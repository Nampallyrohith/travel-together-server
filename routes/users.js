import { UserExists } from "../services/error.js";
import { newRegistration } from "../services/users.js";

export const newRegistrationHandler = async (fullName, email, password, res) => {
    try {
        await newRegistration(fullName, email, password)
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
        if (e instanceof UserExists){
            return res.status(400).json({error: "User already registered."})
        }
        return res.status(500).json({ error: e.message || "An unknown error occurred" });
    }
}