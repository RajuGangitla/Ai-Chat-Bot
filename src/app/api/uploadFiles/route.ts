import { NextRequest, NextResponse } from "next/server";
import Files from "@/models/files"
import mongoose from "mongoose";
import { TextLoader } from "langchain/document_loaders/fs/text";


export const POST = async (req: NextRequest) => {

    const data = await req.formData();
    const file = await data.get("file") as unknown as File;
    const userId = req.headers.get('x-user-id');

    try {

        const addFile = await Files.create({
            size: file.size,
            type: file?.type,
            name: file?.name,
            userId: new mongoose.Types.ObjectId(userId as string),
        })

        return NextResponse.json(
            { success: true, addFile },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("server err", error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 422 });
        }

        if (error.code === 11000) { // Duplicate key error
            return NextResponse.json({ error: 'Duplicate Key Error', details: error.keyValue }, { status: 409 });
        }

        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
};

export function handleVectorisation(name: string) {
    if (name.split(".").pop() === "txt") {

    }
}
