import type { IncomingMessage, ServerResponse } from "http";

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
      } catch {
        resolve({ raw });
      }
    });

    req.on("error", reject);
  });
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

  const body = await readBody(req);
  const event = body?.event || "unknown";
  const orderId = body?.data?.id || body?.data?.order_id || body?.order_id || null;

  console.log("Appmax webhook received:", JSON.stringify({ event, orderId, body }));

  sendJson(res, 200, {
    success: true,
    provider: "appmax",
    event,
    order_id: orderId,
  });
}
