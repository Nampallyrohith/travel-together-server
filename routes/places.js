import { postDraftPlace } from "../services/places.js";

export const postDraftPlaceHandler = async (email, res) => {
  const response = await postDraftPlace(email);
  res
    .status(200)
    .json({
      placeId: response.placeId,
      status: response.status,
      isDraft: response.isDraft,
    });
};
