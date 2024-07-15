import { NextRequest, NextResponse } from "next/server";
import Files from "@/models/files"
import mongoose from "mongoose";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { Pinecone } from "@pinecone-database/pinecone"
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { streamToBuffer } from "@/utils";
const pump = promisify(pipeline);

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


        let metadata = {
            userId: userId,
            fileId: addFile?._id,
            fileName: addFile.name
        }

        const isVectorised = await handleVectorisation(metadata, file)
        addFile.isVectorised = isVectorised
        addFile.save()

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


export async function handleVectorisation(metadata: Record<string, any>, file: any) {
    try {
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY as string,
        })

        const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_TOKEN })
        const buffer = await streamToBuffer(file.stream());
        const blob = new Blob([buffer], { type: "application/octet-stream" })

        let loader: any;
        const fileExtension = file.name.split('.').pop().toLowerCase();

        switch (fileExtension) {
            case "txt":
                loader = new TextLoader(blob);
                break;
            case "pdf":
                loader = new PDFLoader(blob);
                break;
            case "docx":
                loader = new DocxLoader(blob);
                break;
            case "doc":
                loader = new DocxLoader(blob);
                break;
            default:
                throw new Error(`Unsupported file extension: ${fileExtension}`);
        }


        const docs: any = await loader.load()

        for (let i = 0; i < docs.length; i++) {
            docs[i].metadata = {
                ...docs[i].metadata,
                ...metadata,
            }
        }

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 100,
        })

        const output = await splitter.splitDocuments(docs)

        let datatobeAdded: any = []
        const embeddingPromises = await Promise.all(output.map(async (chunk, index) => {
            const res = await embeddings.embedQuery(chunk?.pageContent)
            let data = {
                id: `${metadata?.fileName}-${index}`,
                metadata: { ...metadata, text: chunk?.pageContent },
                values: res,
            }
            datatobeAdded.push(data)
        }
        ));
        console.log(datatobeAdded.length, "output")
        // Upsert all chunks in one operation.
        // await pinecone.index(name).namespace(`${metadata?.fileName}-${metadata?.filePath}`).upsert(datatobeAdded);
        await pinecone.index("files").upsert(datatobeAdded);
        return true
    } catch (error) {
        console.log(error, "errro message")
        return false
    }


}

export const GET = async (req: NextRequest) => {

    const userId = req.headers.get('x-user-id');

    try {

        const files = await Files.find({
            userId: new mongoose.Types.ObjectId(userId as string),
        })

        return NextResponse.json(
            { success: true, files: files },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
};


export const DELETE = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const fileId = url.pathname.split('/').pop();


        if (!fileId) {
            return NextResponse.json({ error: "File ID is required" }, { status: 400 });
        }

        const file = await Files.findOne({
            _id: new mongoose.Types.ObjectId(fileId as string),
        })


        const result = await Files.deleteOne({
            _id: new mongoose.Types.ObjectId(fileId as string),
        })

        let data = {
            prefix: `${file?.name}`,
        }

        await deleteVectors(data)


        return NextResponse.json(
            { result: result },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }

}

async function deleteVectors(data: any) {
    try {
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY as string,
        })
        const index = await pinecone.index("files")
        let fetchMore = true;
        let pageToken = undefined;

        while (fetchMore) {
            const results = await index.listPaginated({ prefix: data.prefix, limit: 100, paginationToken: pageToken });
            console.log(results, "results")

            if (results.vectors && results.vectors.length > 0) {
                const vectorIds = results.vectors.map(v => v.id);

                // Perform deletion of fetched vectors
                await index.deleteMany(vectorIds);
                console.log(`Deleted ${vectorIds.length} vectors.`);
            } else {
                fetchMore = false; // No more vectors to fetch
            }

            pageToken = results?.pagination?.next;
            fetchMore = !!pageToken;
        }
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
}

