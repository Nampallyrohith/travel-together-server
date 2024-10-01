import { emailSchema, passwordSchema } from "../schema/users.schema.js";
import { database } from "./db/ConnectionToDB.js";
import { QUERIES } from "./db/queries.js";
import { UserExists } from "./error.js";
import bcrypt from "bcrypt";

export async function checkUserExistsByEmail(email) {
  emailSchema.parse(email);

  const response = await database.get(QUERIES.CHECK_USER_EXISTS, [email]);
  console.log(response);

  if (response && response.email) {
    throw new UserExists("User already Exists");
  }
}

export async function newRegistration(fullName, email, password) {
  await checkUserExistsByEmail(email);

  passwordSchema.parse(password);
  const hashedPassword = await bcrypt.hash(password, 10);
  await database.run(QUERIES.INSERT_USER, [fullName, email, hashedPassword]);
}
