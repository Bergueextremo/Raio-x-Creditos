import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Appmax configuration:");
console.log("APPMAX_BASE_URL:", process.env.APPMAX_BASE_URL || "https://admin.appmax.com.br/api/v3");
console.log("APPMAX_ACCESS_TOKEN:", process.env.APPMAX_ACCESS_TOKEN ? "LOADED" : "MISSING");
console.log("APPMAX_SOFT_DESCRIPTOR:", process.env.APPMAX_SOFT_DESCRIPTOR || "BERGUE");
