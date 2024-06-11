import connectDb from "@/config/db";
import Users from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await connectDb();

        const user = await Users.findOne({ email: body.email }).select('_id email firstName lastName')

        return NextResponse.json({ message: "User created successfully", user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Error in fetching user", message: error.message }, { status: 401 });
    }
}


