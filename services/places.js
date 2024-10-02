import { placesStatusEnum } from "../schema/enums.schema.js";
import { database } from "./db/ConnectionToDB.js";
import { QUERIES } from "./db/queries.js";
import { validateQuery } from "./db/validateQuery.js";
import { getUserByEmail } from "./users.js";

// placeName,
//     address,
//     locationLink,
//     imageUrl,
//     description,
//     visited,
//     isDraft,
//     status,
//     carouselImages,

export async function postDraftPlace(email) {
  const result = await getUserByEmail(email);
  const response = await database.run(QUERIES.INSERT_PLACE_BY_USER_ID, [result.id])
  console.log("response:", response);
  

  const validateResponse = validateQuery(QUERIES.INSERT_PLACE_BY_USER_ID, [result.id], {
    placeId: response.lastID, 
    status: placesStatusEnum.DRAFT,
    isDraft: true 
  });
  return validateResponse
}
