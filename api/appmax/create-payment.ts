import type { IncomingMessage, ServerResponse } from "http";
import { createAppmaxPayment, formatAppmaxError } from "../../appmax";

function readBody(req: IncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function getClientIp(req: IncomingMessage) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress || "127.0.0.1";
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Metodo nao permitido" });
    return;
  }

  try {
    const body = await readBody(req);
    const result = await createAppmaxPayment(body, getClientIp(req));

    sendJson(res, result.status, result.body);
  } catch (error: any) {
    const details = formatAppmaxError(error);
    console.error("Appmax payment error:", JSON.stringify(details));
    sendJson(res, 500, { error: "Erro ao processar pagamento na Appmax", details });
  }
}
