module.exports = function handler(_req, res) {
  res.status(process.env.APPMAX_ACCESS_TOKEN ? 200 : 503).json({
    provider: "appmax",
    base_url: process.env.APPMAX_BASE_URL || "https://admin.appmax.com.br/api/v3",
    token_loaded: Boolean(process.env.APPMAX_ACCESS_TOKEN),
  });
};
