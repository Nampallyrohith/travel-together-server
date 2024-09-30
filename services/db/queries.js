import { z } from "zod";
import { placesStatusEnum } from "../../schema/enums.schema";

var QUERIES;
(function (QUERIES) {
  QUERIES["INSERT_PLACE_ID"] = `
        INSERT INTO places (user_id, status)
        VALUES ($1, 'DRAFT')
        RETURNING places.id as "placeId", status, is_draft as "isDraft";
    `;
})(QUERIES || (QUERIES = {}));

const QUERY_TO_Z_MAPPING = {
  [QUERIES.INSERT_PLACE_ID]: {
    args: [z.number().describe("User ID")],
    rows: {
      placeId: z.number(),
      status: placesStatusEnum,
      isDraft: z.boolean(),
    },
  },
};

export { QUERIES };
