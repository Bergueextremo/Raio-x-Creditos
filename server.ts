import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import { createAppmaxPayment, formatAppmaxError, getAppmaxEnvironmentStatus, getAppmaxErrorStatus } from "./appmax";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const appmaxEnvironment = getAppmaxEnvironmentStatus();
console.log("Environment check:");
console.log("APPMAX_BASE_URL:", appmaxEnvironment.baseUrl);
console.log("APPMAX_ACCESS_TOKEN:", appmaxEnvironment.tokenLoaded ? "LOADED" : "MISSING");

function getClientIp(req: express.Request) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "127.0.0.1";
}

app.post("/api/appmax/create-payment", async (req, res) => {
  try {
    console.log(`Processing Appmax payment request for service: ${req.body?.service?.name}`);
    const result = await createAppmaxPayment(req.body, getClientIp(req));

    res.status(result.status).json(result.body);
  } catch (error: any) {
    const details = formatAppmaxError(error);
    console.error("Appmax payment error:", JSON.stringify(details));
    res.status(getAppmaxErrorStatus(error)).json({ error: "Erro ao processar pagamento na Appmax", details });
  }
});

app.get("/api/appmax/status", (_req, res) => {
  const status = getAppmaxEnvironmentStatus();

  res.status(status.tokenLoaded ? 200 : 503).json({
    provider: "appmax",
    base_url: status.baseUrl,
    token_loaded: status.tokenLoaded,
  });
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
