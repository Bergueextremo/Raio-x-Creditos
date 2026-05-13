import axios from "axios";

export type AppmaxCustomerInput = {
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
};

export type AppmaxServiceInput = {
  name?: string;
  price?: number;
};

export type AppmaxCardInput = {
  name?: string;
  number?: string;
  cvv?: string;
  month?: string | number;
  year?: string | number;
  installments?: string | number;
};

export type AppmaxPaymentRequest = {
  service?: AppmaxServiceInput;
  customer?: AppmaxCustomerInput;
  paymentMethod?: "pix" | "card";
  card?: AppmaxCardInput;
};

function getAppmaxBaseUrl() {
  return process.env.APPMAX_BASE_URL || "https://admin.appmax.com.br/api/v3";
}

function getAppmaxToken() {
  return process.env.APPMAX_ACCESS_TOKEN;
}

function getAppmaxSoftDescriptor() {
  return (process.env.APPMAX_SOFT_DESCRIPTOR || "BERGUE").slice(0, 13);
}

export function getAppmaxEnvironmentStatus() {
  return {
    baseUrl: getAppmaxBaseUrl(),
    tokenLoaded: Boolean(getAppmaxToken()),
  };
}

function requireAppmaxToken() {
  const token = getAppmaxToken();
  if (!token) {
    throw new Error("APPMAX_ACCESS_TOKEN nao configurado");
  }

  return token;
}

function cleanDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function normalizeCardYear(value?: string | number) {
  const year = Number(value);
  if (!Number.isFinite(year)) return NaN;

  return year >= 2000 ? year - 2000 : year;
}

function splitName(name = "Cliente") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstname = parts.shift() || "Cliente";
  const lastname = parts.length ? parts.join(" ") : firstname;

  return { firstname, lastname };
}

function appmaxPayload(data: Record<string, unknown>) {
  return {
    "access-token": requireAppmaxToken(),
    ...data,
  };
}

function extractId(data: any, keys: string[]) {
  for (const key of keys) {
    if (data?.[key]) return data[key];
    if (data?.data?.[key]) return data.data[key];
  }

  return null;
}

function extractPixData(data: any) {
  const candidates = [
    data,
    data?.data,
    data?.payment,
    data?.data?.payment,
    data?.pix,
    data?.data?.pix,
  ].filter(Boolean);

  const findValue = (keys: string[]) => {
    for (const candidate of candidates) {
      for (const key of keys) {
        if (candidate?.[key]) return candidate[key];
      }
    }

    return null;
  };

  return {
    qr_code:
      findValue(["qr_code", "qrcode", "qrCode", "pix_qr_code", "pix_code", "emv", "copy_paste"]),
    qr_code_image:
      findValue(["qr_code_image", "qrcode_image", "qrCodeImage", "pix_qr_code_image", "base64_image"]),
    transaction_id:
      findValue(["transaction_id", "payment_id", "id", "hash"]),
    status: findValue(["status", "payment_status"]),
  };
}

async function createAppmaxCustomer(customer: AppmaxCustomerInput, ip: string) {
  const { firstname, lastname } = splitName(customer.name);
  const phone = cleanDigits(customer.phone);

  const response = await axios.post(
    `${getAppmaxBaseUrl()}/customer`,
    appmaxPayload({
      firstname,
      lastname,
      email: customer.email || "cliente@regularizedigital.com.br",
      telephone: phone,
      ip,
    })
  );

  const customerId = extractId(response.data, ["customer_id", "id"]);
  if (!customerId) {
    throw new Error(`Appmax nao retornou customer_id: ${JSON.stringify(response.data)}`);
  }

  return { customerId, raw: response.data };
}

async function createAppmaxOrder(service: AppmaxServiceInput, customerId: number | string) {
  const productName = service.name || "Servico Regularize Digital";
  const price = Number(service.price || 0);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Valor do servico invalido para criar pedido Appmax");
  }

  const response = await axios.post(
    `${getAppmaxBaseUrl()}/order`,
    appmaxPayload({
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
    throw new Error(`Appmax nao retornou order_id: ${JSON.stringify(response.data)}`);
  }

  return { orderId, raw: response.data };
}

async function createAppmaxPixPayment(orderId: number | string, customerId: number | string, document: string) {
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const response = await axios.post(
    `${getAppmaxBaseUrl()}/payment/pix`,
    appmaxPayload({
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

async function createAppmaxCreditCardPayment(
  orderId: number | string,
  customerId: number | string,
  document: string,
  card: AppmaxCardInput
) {
  const response = await axios.post(
    `${getAppmaxBaseUrl()}/payment/credit-card`,
    appmaxPayload({
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
          soft_descriptor: getAppmaxSoftDescriptor(),
        },
      },
    })
  );

  return response.data;
}

export async function createAppmaxPayment(body: AppmaxPaymentRequest, ip = "127.0.0.1") {
  const { service, customer, paymentMethod = "pix" } = body;

  if (!getAppmaxToken()) {
    return {
      status: 503,
      body: {
        error: "Appmax sem token",
        details: "Configure APPMAX_ACCESS_TOKEN nas variaveis de ambiente da Vercel e faca um novo deploy.",
      },
    };
  }

  if (!service || !customer) {
    return {
      status: 400,
      body: { error: "Dados de servico ou cliente ausentes" },
    };
  }

  const document = cleanDigits(customer.document);
  if (!document) {
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

  const appmaxCustomer = await createAppmaxCustomer(customer, ip);
  const appmaxOrder = await createAppmaxOrder(service, appmaxCustomer.customerId);

  if (paymentMethod === "card") {
    const payment = await createAppmaxCreditCardPayment(
      appmaxOrder.orderId,
      appmaxCustomer.customerId,
      document,
      body.card
    );

    return {
      status: 200,
      body: {
        success: true,
        provider: "appmax",
        payment_method: "card",
        customer_id: appmaxCustomer.customerId,
        order_id: appmaxOrder.orderId,
        payment,
      },
    };
  }

  const payment = await createAppmaxPixPayment(appmaxOrder.orderId, appmaxCustomer.customerId, document);
  const pix = extractPixData(payment);

  return {
    status: 200,
    body: {
      success: true,
      provider: "appmax",
      payment_method: "pix",
      customer_id: appmaxCustomer.customerId,
      order_id: appmaxOrder.orderId,
      pix,
      payment,
    },
  };
}

export function formatAppmaxError(error: any) {
  return error.response?.data || error.message || "Erro desconhecido na Appmax";
}

export function getAppmaxErrorStatus(error: any) {
  if (error.response?.status) {
    return error.response.status >= 500 ? 502 : error.response.status;
  }

  return 500;
}
