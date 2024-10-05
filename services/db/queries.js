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
      description = ?
    WHERE user_id = ? 
      AND id = ?;
  `;

  QUERIES["INSERT_DRAFT_CAROUSAL_IMAGES"] = `
    INSERT INTO carousel_images (place_id, image_url)
    VALUES (? , ?);
  `;

  QUERIES["UPDATE_STATUS_PLACE"] = `
  UPDATE places 
  SET
    status='${placesStatusEnum.ACTIVE}',
    is_draft=false
  WHERE id=? and user_id=?;
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
  `;

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

  QUERIES["GET_ALL_USERS_PLACES"] = `
    SELECT id AS placeId, 
      user_id AS "userId", 
      place_name AS "placeName", 
      address, 
      location_link AS "locationLink", 
      image_url AS "placeImage", 
      description, 
      visited, 
      is_draft AS "isDraft", 
      status 
    FROM places 
    WHERE status = '${placesStatusEnum.ACTIVE}';

  `;

  QUERIES["GET_SINGLE_PLACE"] = `
    SELECT 
      id as placeId, 
      user_id as "userId",
      place_name as "placeName", 
      address, 
      location_link as "locationLink", 
      image_url AS "placeImage", 
      description,
      visited,
      is_draft as "isDraft",
      status
    FROM 
      places 
    WHERE 
      places.id = ? and status='${placesStatusEnum.ACTIVE}';
  `;

  QUERIES["GET_SLIDE_IMAGES_BY_PLACE_ID"] = `
    SELECT image_url as slideImage
    FROM carousel_images
    WHERE place_id=?;
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

  [QUERIES.GET_ALL_USERS_PLACES]: {
    args: [],
    rows: {
      placeId: z.number(),
      userId: z.number(),
      placeName: z.string(),
      address: z.string(),
      locationLink: z.string(),
      placeImage: z.string(),
      description: z.string().nullable(),
      visited: z.number(),
      isDraft: z.number(),
      status: z.string(),
    },
  },

  [QUERIES.GET_SINGLE_PLACE]: {
    args: [z.number().describe("Place ID")],
    rows: {
      placeId: z.number(),
      userId: z.number(),
      placeName: z.string(),
      address: z.string(),
      locationLink: z.string(),
      placeImage: z.string(),
      description: z.string().nullable(),
      visited: z.number(),
      isDraft: z.number(),
      status: z.string(),
    },
  },

  [QUERIES.GET_SLIDE_IMAGES_BY_PLACE_ID]: {
    args: [z.number().describe("Place ID")],
    rows: z.array(
      z.object({
        slideImage: z.string(),
      })
    ),
  },
};

export { QUERIES, QUERY_TO_Z_MAPPING };
