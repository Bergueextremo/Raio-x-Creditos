const axios = require("axios");

const DEFAULT_BASE_URL = "https://admin.appmax.com.br/api/v3";

function getBaseUrl() {
  return process.env.APPMAX_BASE_URL || DEFAULT_BASE_URL;
}

function getToken() {
  return process.env.APPMAX_ACCESS_TOKEN;
}

function cleanDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function splitName(name = "Cliente") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const firstname = parts.shift() || "Cliente";
  const lastname = parts.length ? parts.join(" ") : firstname;

  return { firstname, lastname };
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "127.0.0.1";
}

function payload(data) {
  const token = getToken();
  if (!token) {
    const error = new Error("APPMAX_ACCESS_TOKEN nao configurado");
    error.statusCode = 503;
    throw error;
  }

  return {
    "access-token": token,
    ...data,
  };
}

function extractId(data, keys) {
  for (const key of keys) {
    if (data?.[key]) return data[key];
    if (data?.data?.[key]) return data.data[key];
  }

  return null;
}

function extractPixData(data) {
  const candidates = [
    data,
    data?.data,
    data?.payment,
    data?.data?.payment,
    data?.pix,
    data?.data?.pix,
  ].filter(Boolean);

  const findValue = (keys) => {
    for (const candidate of candidates) {
      for (const key of keys) {
        if (candidate?.[key]) return candidate[key];
      }
    }

    return null;
  };

  return {
    qr_code: findValue(["qr_code", "qrcode", "qrCode", "pix_qr_code", "pix_code", "emv", "copy_paste"]),
    qr_code_image: findValue(["qr_code_image", "qrcode_image", "qrCodeImage", "pix_qr_code_image", "base64_image"]),
    transaction_id: findValue(["transaction_id", "payment_id", "id", "hash"]),
    status: findValue(["status", "payment_status"]),
  };
}

function normalizeCardYear(value) {
  const year = Number(value);
  if (!Number.isFinite(year)) return NaN;

  return year >= 2000 ? year - 2000 : year;
}

function normalizeBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  if (typeof req.body === "string" && req.body.length) {
    return JSON.parse(req.body);
  }

  return {};
}

async function createCustomer(customer, ip) {
  const { firstname, lastname } = splitName(customer.name);

  const response = await axios.post(
    `${getBaseUrl()}/customer`,
    payload({
      firstname,
      lastname,
      email: customer.email || "cliente@regularizedigital.com.br",
      telephone: cleanDigits(customer.phone),
      ip,
    })
  );

  const customerId = extractId(response.data, ["customer_id", "id"]);
  if (!customerId) {
    const error = new Error(`Appmax nao retornou customer_id: ${JSON.stringify(response.data)}`);
    error.statusCode = 502;
    throw error;
  }

  return customerId;
}

async function createOrder(service, customerId) {
  const productName = service.name || "Servico Regularize Digital";
  const price = Number(service.price || 0);

  if (!Number.isFinite(price) || price <= 0) {
    const error = new Error("Valor do servico invalido para criar pedido Appmax");
    error.statusCode = 400;
    throw error;
  }

  const response = await axios.post(
    `${getBaseUrl()}/order`,
    payload({
      products: [
        {
          sku: productName.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 100) || "SERVICO",
          name: productName,
          qty: 1,
          price,
          digital_product: 1,
        },
      ],
      customer_id: customerId,
      discount: 0,
      shipping: 0,
    })
  );

  const orderId = extractId(response.data, ["order_id", "id"]);
  if (!orderId) {
    const error = new Error(`Appmax nao retornou order_id: ${JSON.stringify(response.data)}`);
    error.statusCode = 502;
    throw error;
  }

  return orderId;
}

async function createPixPayment(orderId, customerId, document) {
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const response = await axios.post(
    `${getBaseUrl()}/payment/pix`,
    payload({
      cart: {
        order_id: orderId,
      },
      customer: {
        customer_id: customerId,
      },
      payment: {
        pix: {
          document_number: cleanDigits(document),
          expiration_date: expirationDate,
        },
      },
    })
  );

  return response.data;
}

async function createCreditCardPayment(orderId, customerId, document, card) {
  const response = await axios.post(
    `${getBaseUrl()}/payment/credit-card`,
    payload({
      cart: {
        order_id: orderId,
      },
      customer: {
        customer_id: customerId,
      },
      payment: {
        CreditCard: {
          number: cleanDigits(card.number),
          cvv: cleanDigits(card.cvv),
          month: Number(card.month),
          year: normalizeCardYear(card.year),
          document_number: cleanDigits(document),
          name: card.name,
          installments: Number(card.installments || 1),
          soft_descriptor: (process.env.APPMAX_SOFT_DESCRIPTOR || "BERGUE").slice(0, 13),
        },
      },
    })
  );

  return response.data;
}

function validateRequest(body) {
  const { service, customer, paymentMethod = "pix" } = body;

  if (!getToken()) {
    return {
      status: 503,
      body: {
        error: "Appmax sem token",
        details: "Configure APPMAX_ACCESS_TOKEN nas variaveis de ambiente da Vercel e faca um novo deploy.",
      },
    };
  }

  if (!service || !customer) {
    return { status: 400, body: { error: "Dados de servico ou cliente ausentes" } };
  }

  if (!cleanDigits(customer.document)) {
    return {
      status: 400,
      body: {
        error: "Documento obrigatorio",
        details: "Informe CPF ou CNPJ para gerar o pagamento na Appmax.",
      },
    };
  }

  const phone = cleanDigits(customer.phone);
  if (phone.length < 10 || phone.length > 11) {
    return {
      status: 400,
      body: {
        error: "Telefone obrigatorio",
        details: "Informe um telefone/WhatsApp valido com DDD para criar o cliente na Appmax.",
      },
    };
  }

  if (paymentMethod === "card") {
    const card = body.card;
    const cardNumber = cleanDigits(card?.number);
    const cvv = cleanDigits(card?.cvv);
    const month = Number(card?.month);
    const year = normalizeCardYear(card?.year);

    if (!card || !cardNumber || !cvv || !month || !Number.isFinite(year)) {
      return {
        status: 400,
        body: {
          error: "Dados do cartao obrigatorios",
          details: "Preencha numero, nome, validade, CVV e parcelas do cartao.",
        },
      };
    }

    if (cardNumber.length < 13 || cardNumber.length > 19 || cvv.length < 2 || cvv.length > 4 || month < 1 || month > 12) {
      return {
        status: 400,
        body: {
          error: "Dados do cartao invalidos",
          details: "Confira numero do cartao, mes de validade e CVV antes de tentar novamente.",
        },
      };
    }
  }

  return null;
}

function getErrorStatus(error) {
  if (error.statusCode) return error.statusCode;
  if (error.response?.status) return error.response.status >= 500 ? 502 : error.response.status;

  return 500;
}

function getErrorDetails(error) {
  return error.response?.data || error.message || "Erro desconhecido na Appmax";
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo nao permitido" });
    return;
  }

  try {
    const body = normalizeBody(req);
    const validation = validateRequest(body);

    if (validation) {
      res.status(validation.status).json(validation.body);
      return;
    }

    const { service, customer, paymentMethod = "pix" } = body;
    const document = cleanDigits(customer.document);
    const customerId = await createCustomer(customer, getClientIp(req));
    const orderId = await createOrder(service, customerId);

    if (paymentMethod === "card") {
      const payment = await createCreditCardPayment(orderId, customerId, document, body.card);

      res.status(200).json({
        success: true,
        provider: "appmax",
        payment_method: "card",
        customer_id: customerId,
        order_id: orderId,
        payment,
      });
      return;
    }

    const payment = await createPixPayment(orderId, customerId, document);

    res.status(200).json({
      success: true,
      provider: "appmax",
      payment_method: "pix",
      customer_id: customerId,
      order_id: orderId,
      pix: extractPixData(payment),
      payment,
    });
  } catch (error) {
    const details = getErrorDetails(error);
    console.error("Appmax payment error:", JSON.stringify(details));
    res.status(getErrorStatus(error)).json({
      error: "Erro ao processar pagamento na Appmax",
      details,
    });
  }
};
