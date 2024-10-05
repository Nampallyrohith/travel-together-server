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
  carouselImages,
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
  console.log(carouselImages);

  await Promise.all(
    carouselImages.map((image) =>
      database.run(QUERIES.INSERT_DRAFT_CAROUSAL_IMAGES, [placeId, image])
    )
  );

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

export async function setPostPlace(placeId, email) {
  const result = await getUserByEmail(email);
  await checkPlaceIdExists(placeId, result.id);

  await database.run(QUERIES.UPDATE_STATUS_PLACE, [placeId, result.id]);

  const response = await database.get(QUERIES.GET_UPDATED_PLACE, [
    result.id,
    placeId,
  ]);

  const validateResponse = await validateQueryResponse(
    QUERIES.GET_UPDATED_PLACE,
    [result.id],
    response
  );

  return validateResponse;
}

export async function getAllPlaces() {
  const response = await database.all(QUERIES.GET_ALL_USERS_PLACES);
  return response;
}

export async function getSinglePlace(placeId) {
  placeIdSchema.parse(placeId);
  // await checkPlaceIdExists(placeId);
  const placeInfo = await database.get(QUERIES.GET_SINGLE_PLACE, [placeId]);
  const slideImages = await database.all(QUERIES.GET_SLIDE_IMAGES_BY_PLACE_ID, [
    placeId,
  ]);

  const validateInfo = validateQueryResponse(
    QUERIES.GET_SINGLE_PLACE,
    [placeId],
    placeInfo
  );
  // const validateSlideImages = validateQueryResponse(
  //   QUERIES.GET_SLIDE_IMAGES_BY_PLACE_ID,
  //   [placeId],
  //   slideImages
  // );

  return {
    validateInfo,
    slideImages,
  };
}
