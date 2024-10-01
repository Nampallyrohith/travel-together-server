import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import z from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: path.join(__dirname, "../.env.dev") });
const envSchema = z.object({
    PORT: z.coerce.number().int().positive(),
});

const env = envSchema.parse(process.env);

export default env;
