import { placesStatusEnum } from "../schema/enums.schema.js";
import { placeIdSchema } from "../schema/places.schema.js";
import { database } from "./db/ConnectionToDB.js";
import { QUERIES } from "./db/queries.js";
import {
  validateQueryArguments,
  validateQueryResponse,
} from "./db/validateQuery.js";
import { InvalidParams } from "./error.js";
import { getUserByEmail } from "./users.js";

export async function checkPlaceIdExists(placeId, userId) {
  placeIdSchema.parse(placeId);

  const query = QUERIES.CHECK_PLACE_ID_EXISTS;

  const response = await database.get(query, [placeId, userId]);

  if (!response) {
    throw new InvalidParams("Place Id doesn't exists or invalid");
  }
}

// Insert the draft place
export async function postDraftPlace(email) {
  const result = await getUserByEmail(email);

  const query = QUERIES.INSERT_PLACE_BY_USER_ID;

  validateQueryArguments(query, [result.id]);

  await database.run(query, [result.id]);

  const placeIdResult = await database.get(QUERIES.GET_LAST_ROW_ID_FROM_PLACES);

  return placeIdResult.placeId;
}

//Update place
export async function setDraftPlace(
  placeName,
  address,
  locationLink,
  imageUrl,
  description,
  // carouselImages,
  email,
  placeId
) {
  const result = await getUserByEmail(email);
  await checkPlaceIdExists(placeId, result.id);

  await database.run(QUERIES.UPDATE_DRAFT_PLACE, [
    placeName,
    address,
    locationLink,
    imageUrl,
    description,
    result.id,
    placeId,
  ]);

  const response = await database.get(QUERIES.GET_UPDATED_PLACE, [
    result.id,
    placeId,
  ]);

  // Validate the updated row after the query
  // TO-DO: Maintain error handling
  const validateResponse = await validateQueryResponse(
    QUERIES.GET_UPDATED_PLACE,
    [result.id],
    response
  );

  return validateResponse;
}
