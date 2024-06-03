import connectDb from "@/config/db";
import Users from "@/models/users";
import { UserSchema } from "@/types/signup";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDb;

    try {
        const body = await req.json();
        console.log(body, "body ")
        const result = UserSchema.safeParse(body);
        console.log(result, "result ")
        if (result.success) {
            await Users.create(body)
            return NextResponse.json({ success: true });
        }
        const serverErrors = Object.fromEntries(
            result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
        );

        // Respond with a JSON object containing the validation errors
        return NextResponse.json({ errors: serverErrors });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: error },
            {
                status: 500,
            }
        );
    }
}
