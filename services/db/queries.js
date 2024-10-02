import { z } from "zod";
import { placesStatusEnum, PlaceStatusEnum } from "../../schema/enums.schema.js";

var QUERIES;
(function (QUERIES) {
  QUERIES["CHECK_USER_EXISTS"] = `
    SELECT email FROM users WHERE email=$1;
  `;

  QUERIES["GET_USER_BY_EMAIL"] = `
  SELECT id, full_name as "fullName", email
  FROM users
  WHERE email=$1;
`;

  QUERIES["INSERT_USER"] = `
    INSERT INTO users (full_name, email, password_hash)
    VALUES ($1, $2, $3);
  `;

  QUERIES["GET_USER_HASHED_PASSWORD"] = `
    SELECT password_hash as "passwordHash" FROM users 
    WHERE email=$1;
  `;

  QUERIES["INSERT_PLACE_BY_USER_ID"] = `
    INSERT INTO places (user_id, status)
    VALUES ($1, '${placesStatusEnum.DRAFT}')
    RETURNING id as "placeId", status, is_draft as "isDraft";
  `;
})(QUERIES || (QUERIES = {}));

const QUERY_TO_Z_MAPPING = {
  [QUERIES.CHECK_USER_EXISTS]: {
    args: [z.string().describe("Email ID")],
    rows: {
      email: z.string(),
    },
  },

  [QUERIES.GET_USER_BY_EMAIL]: {
    args: [z.string().describe("Email ID")],
    rows: {
      id: z.number(),
      fullName: z.string(),
      email: z.string(),
    },
  },

  [QUERIES.INSERT_USER]: {
    args: [
      z.string().describe("Full name"),
      z.string().describe("Email ID"),
      z.string().describe("Hashed Password"),
    ],
    rows: {},
  },

  [QUERIES.GET_USER_HASHED_PASSWORD]: {
    args: [z.string().describe("Email ID")],
    rows: {
      passwordHash: z.string(),
    },
  },

  [QUERIES.INSERT_PLACE_BY_USER_ID]: {
    args: [z.number().describe("User ID")],
    rows: {
      placeId: z.number(),
      status: PlaceStatusEnum,
      isDraft: z.boolean(),
    },
  },
};

export { QUERIES, QUERY_TO_Z_MAPPING };
