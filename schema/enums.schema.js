import {z} from "zod"

export const placesStatusEnum = z.enum([
    "DRAFT",
    "ACTIVE"
])

