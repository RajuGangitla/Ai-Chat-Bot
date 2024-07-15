import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from "@langchain/openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_TOKEN!,
});

export const runtime = 'edge'

// Handles GET requests to /api
export async function POST(req: Request) {
    if (!process.env.OPENAI_TOKEN) {
        return NextResponse.json({ error: "OpenAI API key is missing." }, { status: 500 });
    }

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        const context = await queryPineConeVectorsRetriever(lastMessage.content);
        const prompt = [{
            role: 'system',
            content: `You are a helpful assistant.
                You will take into account any CONTEXT BLOCK
                that is provided in a conversation.
                START CONTEXT BLOCK
                ${context.map((c: any) => c.metadata.text).join("\n")}
                END OF CONTEXT BLOCK`,
        }];

        const newMessages = [...prompt, ...messages];

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: newMessages || [],
        });

        return NextResponse.json({ message: response.choices[0].message.content });

    } catch (error: any) {
        console.error("Error in POST /api:", error);
        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
}


async function queryPineConeVectorsRetriever(question: string) {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
    })

    const pineconeIndex = pinecone.Index("files")
    const queryEmbedding = await new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_TOKEN }).embedQuery(question)
    // 4. Query Pinecone index and return top 10 matches
    let queryResponse = await pineconeIndex.query({
        topK: 10,
        vector: queryEmbedding,
        includeMetadata: true,
        includeValues: true,
    });

    return queryResponse.matches


}