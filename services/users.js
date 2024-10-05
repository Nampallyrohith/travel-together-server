import jwt from "jsonwebtoken";
import { passwordSchema } from "../schema/users.schema.js";
import { database } from "./db/ConnectionToDB.js";
import { QUERIES } from "./db/queries.js";
import { IncorrectPassword, NoUserFound, UserExists } from "./error.js";
import bcrypt from "bcrypt";
import {
  validateQueryArguments,
  validateQueryResponse,
} from "./db/validateQuery.js";

export async function getUserByEmail(email) {
  // emailSchema.parse(email);
  const query = QUERIES.GET_USER_BY_EMAIL;
  

  await validateQueryArguments(query, [email]);

  const response = await database.get(query, [email]);

  const validateResponse = await validateQueryResponse(
    query,
    [email],
    response
  );

  return validateResponse;
}

export async function checkUserExistsByEmail(email) {
  const query = QUERIES.CHECK_USER_EXISTS;

  validateQueryArguments(query, [email]);

  const response = await database.get(query, [email]);

  if (!response || response.length === 0) {
    return false;
  }

  const validateResponse = validateQueryResponse(query, [email], response);

  return validateResponse && validateResponse.email && true;
}

export async function getUserHashedPassword(email) {
  const response = await database.get(QUERIES.GET_USER_HASHED_PASSWORD, [
    email,
  ]);

  const validateResponse = validateQueryResponse(
    QUERIES.GET_USER_HASHED_PASSWORD,
    [email],
    response
  );

  if (validateResponse && validateResponse.passwordHash) {
    return validateResponse.passwordHash;
  }
}

export async function newRegistration(fullName, email, password) {
  const isUserExists = await checkUserExistsByEmail(email);

  if (isUserExists) {
    throw new UserExists("User already Exists");
  }
  passwordSchema.parse(password);
  const hashedPassword = await bcrypt.hash(password, 10);

  await database.run(QUERIES.INSERT_USER, [fullName, email, hashedPassword]);
}

export async function loginUser(email, password) {
  const isUserExists = await checkUserExistsByEmail(email);

  if (!isUserExists) {
    throw new NoUserFound("No user found");
  }
  passwordSchema.parse(password);
  const userHashedPassword = await getUserHashedPassword(email);

  const comparePasswords = await bcrypt.compare(password, userHashedPassword);

  if (!comparePasswords) {
    throw new IncorrectPassword("Password Incorrect");
  }

  const payload = { email };
  const token = jwt.sign(payload, "SR_KEY");

  return token;
}
