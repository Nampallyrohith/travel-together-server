import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    res.status(401).json({ message: "Not found JWT token." });
  } else {
    jwtToken = authHeader.split(" ")[1];
    
    jwt.verify(jwtToken, "SR_KEY", (error, payload) => {
      if (error) {
        res.status(401).json({ message: "Invalid JWT token." });
      } else {
        req.email = payload.email;
        next();
      }
    });
  }
};
