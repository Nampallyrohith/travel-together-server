import express from "express";
import { initializeDBAndStartServer } from "./services/db/ConnectionToDB.js";
import { loginUserHandler, newRegistrationHandler } from "./routes/users.js";

export const app = express();

app.use(express.json());

// connect to db
initializeDBAndStartServer();

// testing file
app.get("/", async (req, res) => {
  res.send("Hello word");
});

//register a user
app.post("/user/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  await newRegistrationHandler(fullName, email, password, res);
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  await loginUserHandler(email, password, res);
});
