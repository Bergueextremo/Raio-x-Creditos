import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const APPMAX_BASE_URL = process.env.APPMAX_BASE_URL || "https://admin.appmax.com.br/api/v3";
const APPMAX_ACCESS_TOKEN = process.env.APPMAX_ACCESS_TOKEN;
const APPMAX_SOFT_DESCRIPTOR = (process.env.APPMAX_SOFT_DESCRIPTOR || "BERGUE").slice(0, 13);

console.log("Environment check:");
console.log("APPMAX_BASE_URL:", APPMAX_BASE_URL);
console.log("APPMAX_ACCESS_TOKEN:", APPMAX_ACCESS_TOKEN ? "LOADED" : "MISSING");

type AppmaxCustomerInput = {
  name?: string;
  email?: string;
  document?: string;
  phone?: string;
};

type AppmaxServiceInput = {
  name?: string;
  price?: number;
};

type AppmaxCardInput = {
  name?: string;
  number?: string;
  cvv?: string;
  month?: string | number;
  year?: string | number;
  installments?: string | number;
};

function requireAppmaxToken() {
  if (!APPMAX_ACCESS_TOKEN) {
    throw new Error("APPMAX_ACCESS_TOKEN nao configurado no .env");
  }

  return APPMAX_ACCESS_TOKEN;
}

function cleanDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function splitName(name = "Cliente") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstname = parts.shift() || "Cliente";
  const lastname = parts.length ? parts.join(" ") : firstname;

  return { firstname, lastname };
}

function getClientIp(req: express.Request) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "127.0.0.1";
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

async function createAppmaxCustomer(customer: AppmaxCustomerInput, req: express.Request) {
  const { firstname, lastname } = splitName(customer.name);
  const phone = cleanDigits(customer.phone);

  const response = await axios.post(
    `${APPMAX_BASE_URL}/customer`,
    appmaxPayload({
      firstname,
      lastname,
      email: customer.email || "cliente@regularizedigital.com.br",
      telephone: phone,
      ip: getClientIp(req),
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
    `${APPMAX_BASE_URL}/order`,
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
    `${APPMAX_BASE_URL}/payment/pix`,
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
    `${APPMAX_BASE_URL}/payment/credit-card`,
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
          year: Number(card.year),
          document_number: cleanDigits(document),
          name: card.name,
          installments: Number(card.installments || 1),
          soft_descriptor: APPMAX_SOFT_DESCRIPTOR,
        },
      },
    })
  );

  return response.data;
}

// API Routes
app.post("/api/appmax/create-payment", async (req, res) => {
  try {
    const { service, customer, paymentMethod = "pix" } = req.body as {
      service?: AppmaxServiceInput;
      customer?: AppmaxCustomerInput;
      paymentMethod?: "pix" | "card";
      card?: AppmaxCardInput;
    };

    if (!service || !customer) {
      return res.status(400).json({ error: "Dados de servico ou cliente ausentes" });
    }

    const document = cleanDigits(customer.document);
    if (!document) {
      return res.status(400).json({
        error: "Documento obrigatorio",
        details: "Informe CPF ou CNPJ para gerar o Pix na Appmax.",
      });
    }

    console.log(`Processing Appmax payment request for service: ${service.name}`);

    const appmaxCustomer = await createAppmaxCustomer(customer, req);
    const appmaxOrder = await createAppmaxOrder(service, appmaxCustomer.customerId);

    if (paymentMethod === "card") {
      if (!req.body.card) {
        return res.status(400).json({
          error: "Dados do cartao obrigatorios",
          details: "Informe os dados do cartao para processar o pagamento na Appmax.",
        });
      }

      const payment = await createAppmaxCreditCardPayment(
        appmaxOrder.orderId,
        appmaxCustomer.customerId,
        document,
        req.body.card
      );

      return res.json({
        success: true,
        provider: "appmax",
        payment_method: "card",
        customer_id: appmaxCustomer.customerId,
        order_id: appmaxOrder.orderId,
        payment,
      });
    }

    const payment = await createAppmaxPixPayment(appmaxOrder.orderId, appmaxCustomer.customerId, document);
    const pix = extractPixData(payment);

    res.json({
      success: true,
      provider: "appmax",
      payment_method: "pix",
      customer_id: appmaxCustomer.customerId,
      order_id: appmaxOrder.orderId,
      pix,
      payment,
    });
  } catch (error: any) {
    const details = error.response?.data || error.message;
    console.error("Appmax payment error:", JSON.stringify(details));
    res.status(500).json({ error: "Erro ao processar pagamento na Appmax", details });
  }
});

app.post("/api/appmax/webhook", (req, res) => {
  const event = req.body?.event || req.query.event || "unknown";
  const orderId =
    req.body?.data?.id ||
    req.body?.data?.order_id ||
    req.body?.order_id ||
    req.query.order_id ||
    null;

  console.log("Appmax webhook received:", JSON.stringify({ event, orderId, body: req.body, query: req.query }));

  res.status(200).json({
    success: true,
    provider: "appmax",
    event,
    order_id: orderId,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
