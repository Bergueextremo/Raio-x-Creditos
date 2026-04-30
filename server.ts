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

console.log("Environment check:");
console.log("KIWIFY_CLIENT_ID:", process.env.KIWIFY_CLIENT_ID ? "LOADED" : "MISSING");
console.log("KIWIFY_CLIENT_SECRET:", process.env.KIWIFY_CLIENT_SECRET ? "LOADED" : "MISSING");
console.log("KIWIFY_ACCOUNT_ID:", process.env.KIWIFY_ACCOUNT_ID ? "LOADED" : "MISSING");

// Kiwify Config
const KIWIFY_BASE_URL = "https://public-api.kiwify.com";
const CLIENT_ID = process.env.KIWIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.KIWIFY_CLIENT_SECRET;
const ACCOUNT_ID = process.env.KIWIFY_ACCOUNT_ID;

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getKiwifyToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  console.log("Fetching new Kiwify token...");

  try {
    // Kiwify public API expects client_id and client_secret
    // Try providing them in a way that matches what we did in curl
    const response = await axios({
      method: 'post',
      url: `${KIWIFY_BASE_URL}/v1/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });

    if (response.data && response.data.access_token) {
      cachedToken = response.data.access_token;
      tokenExpiry = now + (response.data.expires_in || 86400) * 1000;
      console.log("Kiwify token retrieved successfully.");
      return cachedToken;
    } else {
      throw new Error(`Unexpected response structure: ${JSON.stringify(response.data)}`);
    }
  } catch (error: any) {
    const errorDetail = error.response?.data || error.message;
    console.error("Kiwify Authentication Error Detail:", JSON.stringify(errorDetail));

    // One more try with JSON if urlencoded failed (some SDKs/proxies change this)
    try {
      console.log("Retrying with JSON payload...");
      const jsonResponse = await axios.post(`${KIWIFY_BASE_URL}/v1/oauth/token`, {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });
      if (jsonResponse.data?.access_token) {
        cachedToken = jsonResponse.data.access_token;
        tokenExpiry = now + (jsonResponse.data.expires_in || 86400) * 1000;
        return cachedToken;
      }
    } catch (innerError: any) {
      console.error("Kiwify JSON Retry failed too.");
    }

    throw new Error(`Failed to authenticate with Kiwify API. Details: ${JSON.stringify(errorDetail)}`);
  }
}

async function getKiwifyProducts() {
  try {
    const token = await getKiwifyToken();
    if (!token) return [];

    console.log("Fetching products from Kiwify...");
    const response = await axios({
      method: "get",
      url: `${KIWIFY_BASE_URL}/v1/products`,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-kiwify-account-id": ACCOUNT_ID,
      },
    });

    const products = Array.isArray(response.data) ? response.data : (response.data.data || []);
    console.log(`Found ${products.length} products in Kiwify account.`);
    return products;
  } catch (error: any) {
    console.error("Error fetching Kiwify products:", error.response?.data || error.message);
    return [];
  }
}

// Map service names to Kiwify Checkout IDs/Links (Manual Fallback)
const CHECKOUT_LINKS: Record<string, string> = {
  "ABRIR MEI": "https://pay.kiwify.com.br/AbC1234",
  "BAIXA MEI": "https://pay.kiwify.com.br/DeF5678",
  "ALTERAR MEI": "https://pay.kiwify.com.br/GhI9012",
  "default": "https://pay.kiwify.com.br/configurar_no_server_ts"
};

// API Routes
app.post("/api/kiwify/create-payment", async (req, res) => {
  try {
    const { service, customer } = req.body;

    if (!service || !customer) {
      return res.status(400).json({ error: "Missing service or customer data" });
    }

    console.log(`Processing payment request for service: ${service.name}`);

    // 1. Authenticate
    try {
      await getKiwifyToken();
    } catch (tokenError: any) {
      return res.status(500).json({ error: "Kiwify Authentication Failed", details: tokenError.message });
    }

    // 2. Try to find the product dynamically in Kiwify
    let baseUrl = "";
    const products = await getKiwifyProducts();
    const matchedProduct = products.find((p: any) =>
      p.name.trim().toUpperCase() === service.name.trim().toUpperCase() && p.checkout_url
    );

    if (matchedProduct) {
      console.log(`Dynamic match found for "${service.name}": ${matchedProduct.checkout_url}`);
      baseUrl = matchedProduct.checkout_url;
    } else {
      console.log(`No dynamic match for "${service.name}". Using manual mapping.`);
      baseUrl = CHECKOUT_LINKS[service.name] || CHECKOUT_LINKS["default"];
    }

    // Check if it's still a placeholder
    if (!baseUrl || baseUrl.includes("placeholder") || baseUrl.includes("configurar_no_server_ts") || baseUrl.includes("AbC1234")) {
      return res.status(400).json({
        error: "Link do Checkout não encontrado",
        details: `O serviço "${service.name}" não foi encontrado no seu dashboard da Kiwify (verifique se o nome é idêntico) e também não possui um link manual configurado no server.ts.`
      });
    }

    // 3. Construct the prefilled checkout URL
    const checkoutUrl = new URL(baseUrl);
    if (customer.name) checkoutUrl.searchParams.append('name', customer.name);
    if (customer.email) checkoutUrl.searchParams.append('email', customer.email);

    const cleanDoc = (customer.document || '').replace(/\D/g, '');
    if (cleanDoc) checkoutUrl.searchParams.append('cpf_cnpj', cleanDoc);

    const cleanPhone = (customer.phone || '').replace(/\D/g, '');
    if (cleanPhone) checkoutUrl.searchParams.append('phone', cleanPhone);

    console.log(`Checkout generated for ${service.name}: ${checkoutUrl.toString()}`);

    res.json({
      success: true,
      checkout_url: checkoutUrl.toString()
    });
  } catch (error: any) {
    console.error("Payment error:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
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
