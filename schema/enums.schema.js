import {z} from "zod"

// export const placesStatusEnum = z.enum([
//     "DRAFT",
//     "ACTIVE"
// ])

export const placesStatusEnum = Object.freeze({
    DRAFT: "DRAFT",
    ACTIVE: "ACTIVE"
  });
  

export const PlaceStatusEnum = z.nativeEnum(placesStatusEnum)