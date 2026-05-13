import type { IncomingMessage, ServerResponse } from "http";
import { getAppmaxEnvironmentStatus } from "../../appmax";

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  const status = getAppmaxEnvironmentStatus();

  res.statusCode = status.tokenLoaded ? 200 : 503;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({
    provider: "appmax",
    base_url: status.baseUrl,
    token_loaded: status.tokenLoaded,
  }));
}
