import { NextRequest, NextResponse } from "next/server";
import Files from "@/models/files"
import mongoose from "mongoose";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { Pinecone } from "@pinecone-database/pinecone"

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

        const pineconeIndex = pinecone.Index("files")
        const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_TOKEN })
        const blob = new Blob([file.buffer], { type: "application/octet-stream" })
        let loader: any
        if (file.name.split(".").pop() === "txt") {
            loader = new TextLoader(blob)
        }
        if (file.name.split(".").pop() === "pdf") {
            loader = new PDFLoader(blob)
        }
        if (file.name.split(".").pop() === "docx") {
            loader = new DocxLoader(blob)
        }
        if (file.name.split(".").pop() === "doc") {
            loader = new DocxLoader(blob)
        }
        // if (file.originalname.split(".").pop() === "csv") {
        //     loader = new CSVLoader(blob)
        // }

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
                id: `${metadata?.fileName}`,
                metadata: { ...metadata, text: chunk?.pageContent },
                values: res,
            }
            datatobeAdded.push(data)
        }
        ));

        // Upsert all chunks in one operation.
        // await pinecone.index(name).namespace(`${metadata?.fileName}-${metadata?.filePath}`).upsert(datatobeAdded);
        await pinecone.index("files").upsert(datatobeAdded);
        return true
    } catch (error) {
        console.log(error, "errro message")
        return false
    }
}
