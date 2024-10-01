
import {z} from "zod"

export const emailSchema = z.string().email('Invalid email format');
// TO-DO: remove after completion of project
export const passwordSchema = z
    .string()
    .min(8)
    .max(20) 
// .regex(/[a-z]/, "Password must contain at least one lowercase letter")
// .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
// .regex(/[0-9]/, "Password must contain at least one number")
// .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")