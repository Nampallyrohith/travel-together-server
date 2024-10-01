import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url"; 

import { app } from "../../server.js";

import env from "../config.js"


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const PORT = env.PORT || 3000; 

const databasePath = path.join(__dirname, "myplaces.db");

let database; 

export const initializeDBAndStartServer = async () => {
    try {
        database = await open({
            filename: databasePath,
            driver: sqlite3.Database,
        });
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};


export { database }