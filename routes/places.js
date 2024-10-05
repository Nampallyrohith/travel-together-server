import {
  getAllPlaces,
  getSinglePlace,
  postDraftPlace,
  setDraftPlace,
  setPostPlace,
} from "../services/places.js";
import { InvalidParams } from "../services/error.js";

export const postDraftPlaceHandler = async (email, res) => {
  const response = await postDraftPlace(email);

  res.status(200).json({
    message: "New place inserted",
    placeId: response,
    status: "DRAFT",
    isDraft: true,
  });
};

export const setDraftplaceHandler = async (
  email,
  res,
  placeId,
  placeName,
  address,
  locationLink,
  imageUrl,
  description,
  carouselImages
) => {
  try {
    const response = await setDraftPlace(
      placeName,
      address,
      locationLink,
      imageUrl,
      description,
      carouselImages,
      email,
      placeId
    );

    res.status(200).json({
      message: "Place successfully updated.",
      data: {
        placeId: response.placeId,
        status: response.status,
        isDraft: Boolean(response.isDraft),
      },
    });
  } catch (e) {
    if (e instanceof InvalidParams) {
      return res
        .status(400)
        .json({ message: "Place Id doesn't exists or invalid user." });
    }
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const setPostPlaceHandler = async (res, placeId, email) => {
  const response = await setPostPlace(placeId, email);
  res.status(200).json({
    message: "Place successfully updated.",
    data: {
      placeId: response.placeId,
      status: response.status,
      isDraft: Boolean(response.isDraft),
    },
  });
};


export const getAllPlacesHander = async (res) => {
  const response = await getAllPlaces();
  return res.status(200).json({
    message: "Places are retrieved successfully.",
    data: response
  })
}

export const getSinglePlaceHandler = async (res, placeId) => {
  const response = await getSinglePlace(placeId)

  return res.status(200).json({
    message: "Place retrieved successfully",
    data: {
      placeInfo: response.validateInfo,
      slideImage: response.slideImages.map(image => image.slideImage),
    }
  })
}