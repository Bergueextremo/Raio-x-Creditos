module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo nao permitido" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const event = body?.event || "unknown";
  const orderId = body?.data?.id || body?.data?.order_id || body?.order_id || null;

  console.log("Appmax webhook received:", JSON.stringify({ event, orderId, body }));

  res.status(200).json({
    success: true,
    provider: "appmax",
    event,
    order_id: orderId,
  });
};
