import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const KIWIFY_BASE_URL = "https://public-api.kiwify.com";
const CLIENT_ID = process.env.KIWIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.KIWIFY_CLIENT_SECRET;
const ACCOUNT_ID = process.env.KIWIFY_ACCOUNT_ID;

async function test() {
    console.log("Fetching Kiwify Token...");
    try {
        const authResponse = await axios({
            method: 'post',
            url: `${KIWIFY_BASE_URL}/v1/oauth/token`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
        });

        const token = authResponse.data.access_token;
        console.log("Token obtained. Fetching products...");
        console.log("Using Account ID:", ACCOUNT_ID);

        const productsResponse = await axios({
            method: 'get',
            url: `${KIWIFY_BASE_URL}/v1/products`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-kiwify-account-id': ACCOUNT_ID
            }
        });

        console.log("Full response keys:", Object.keys(productsResponse.data));

        // Products are usually in a 'data' field or the root
        const products = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.data || []);

        console.log("Total products found:", products.length);
        if (products.length > 0) {
            console.log("First Product:", JSON.stringify(products[0], null, 2));
        } else {
            console.log("Raw Response Data:", JSON.stringify(productsResponse.data, null, 2));
        }
    } catch (error) {
        console.error("FAILED");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data));
        } else {
            console.error("Error:", error.message);
        }
    }
}

test();
