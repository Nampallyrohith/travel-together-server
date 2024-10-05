import { z } from "zod";
import {
  placesStatusEnum,
  PlaceStatusEnum,
} from "../../schema/enums.schema.js";

var QUERIES;
(function (QUERIES) {
  // Check if a user exists by email
  QUERIES["CHECK_USER_EXISTS"] = `
    SELECT email FROM users WHERE email = ?;
  `;

  // Get user details by email
  QUERIES["GET_USER_BY_EMAIL"] = `
    SELECT id, full_name as "fullName", email
    FROM users
    WHERE email = ?;
  `;

  // Insert a new user
  QUERIES["INSERT_USER"] = `
    INSERT INTO users (full_name, email, password_hash)
    VALUES (?, ?, ?);
  `;

  // Get the hashed password for a user by email
  QUERIES["GET_USER_HASHED_PASSWORD"] = `
    SELECT password_hash as "passwordHash" FROM users 
    WHERE email = ?;
  `;

  // Update an existing draft place
  QUERIES["UPDATE_DRAFT_PLACE"] = `
    UPDATE places 
    SET 
      place_name = ?, 
      address = ?, 
      location_link = ?, 
      image_url = ?, 
      description = ?,
      status='${placesStatusEnum.ACTIVE}',
      is_draft=FALSE
    WHERE user_id = ? 
      AND id = ?;
  `;

  // Fetch the updated place after the update
  QUERIES["GET_UPDATED_PLACE"] = `
    SELECT id as "placeId", status, is_draft as "isDraft"
    FROM places 
    WHERE user_id = ? 
      AND id = ?;
  `;

  // Insert a new draft place for a user
  QUERIES["INSERT_PLACE_BY_USER_ID"] = `
    INSERT INTO places (user_id, status)
    VALUES (?, '${placesStatusEnum.DRAFT}');
  `;

  QUERIES["GET_LAST_ROW_ID_FROM_PLACES"] = `
    SELECT last_insert_rowid() as "placeId"
  `

  // Fetch the newly inserted place
  QUERIES["GET_NEW_PLACE"] = `
    SELECT id as "placeId", status, is_draft as "isDraft"
    FROM places 
    WHERE user_id = ? and id = ?;
  `;

  QUERIES["CHECK_PLACE_ID_EXISTS"] = `
    SELECT id as "placeId" 
    FROM places
    WHERE id=? and user_id=?;
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

  [QUERIES.UPDATE_DRAFT_PLACE]: {
    args: [
      z.string().describe("Place name"),
      z.string().describe("Address"),
      z.string().describe("Location link"),
      z.string().describe("Image URL"),
      z.string().describe("Description"),
      z.boolean().describe("Visited"),
      z.number().describe("User ID"),
      z.number().describe("Place ID"),
    ],
    rows: {}, // No return directly from the update
  },

  [QUERIES.GET_UPDATED_PLACE]: {
    args: [z.number().describe("User ID"), z.number().describe("Place ID")],
    rows: {
      placeId: z.number(),
      status: PlaceStatusEnum,
      isDraft: z.number(),
    },
  },

  [QUERIES.INSERT_PLACE_BY_USER_ID]: {
    args: [z.number().describe("User ID")],
    rows: {}, 
  },

  [QUERIES.GET_NEW_PLACE]: {
    args: [z.number().describe("User ID")],
    rows: {
      placeId: z.number(),
      status: PlaceStatusEnum,
      isDraft: z.boolean(),
    },
  },
  [QUERIES.CHECK_PLACE_ID_EXISTS]: {
    args: [z.number().describe("Place ID")],
    rows: {
      placeId: z.number(),
    },
  },
};

export { QUERIES, QUERY_TO_Z_MAPPING };
