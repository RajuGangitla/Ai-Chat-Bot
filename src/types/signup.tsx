import { z, ZodType } from "zod";

export interface ISignUpForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ErrorResponse {
    message: string;
}

export const UserSchema: ZodType<ISignUpForm> = z.object({
    email: z.string({
        required_error: "email is required",
    }).email(),
    firstName: z
        .string({
            required_error: "first name is required"
        })
        .min(3, { message: "first name is too short " })
        .max(8, { message: "first name is too long" }),
    lastName: z
        .string({
            required_error: "last name is required"
        })
        .min(3, { message: "last name is too short" })
        .max(8, { message: "last name is too long" }),
    password: z
        .string({
            required_error: "password is required"
        })
        .min(8, { message: "Password is too short" })
        .max(20, { message: "Password is too long" }),
});


export interface IloginForm {
    email: string;
    password: string;
}