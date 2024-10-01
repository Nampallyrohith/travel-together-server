import express from "express"
import { initializeDBAndStartServer } from "./services/db/ConnectionToDB.js"

export const app = express()

app.use(express.json())

// connect to db
initializeDBAndStartServer()

app.get('/', async (req, res) => {
    res.send("Hello word")
})

