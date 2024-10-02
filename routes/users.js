import {
  IncorrectPassword,
  NoUserFound,
  UserExists,
} from "../services/error.js";
import { loginUser, newRegistration } from "../services/users.js";

export const newRegistrationHandler = async (
  fullName,
  email,
  password,
  res
) => {
  try {
    await newRegistration(fullName, email, password);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    if (e instanceof UserExists) {
      return res.status(400).json({ message: "User already registered." });
    }
    return res
      .status(500)
      .json({ error: e.message || "An unknown error occurred." });
  }
};

export const loginUserHandler = async (email, password, res) => {
  try {
    const response = await loginUser(email, password);
    return res
      .status(200)
      .json({ message: "Login successfull.", email, jwtToken: response });
  } catch (e) {
    if (e instanceof NoUserFound) {
      return res.status(400).json({ message: "No user found." });
    } else if (e instanceof IncorrectPassword) {
      return res.status(400).json({ message: "Credential Invalid." });
    }
    return res
      .status(500)
      .json({ error: e.message || "An unknown error occured." });
  }
};
