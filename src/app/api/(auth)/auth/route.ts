import connectDb from "@/config/db";
import Users from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await connectDb();

        if (!body.email || !body.password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await Users.create(body);

        return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
    } catch (error: any) {
        console.error("Error in creating user:", error);
        return NextResponse.json({ error: "Error in creating user", message: error.message }, { status: 500 });
    }
}


export const GET = async () => {

}

