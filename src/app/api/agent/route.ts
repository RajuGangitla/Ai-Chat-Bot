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

    const { messages } = await req.json()

    const lastMessage = messages[messages?.length - 1]

    const context = await queryPineConeVectorsRetriever(lastMessage?.content)
    const prompt = [{
        role: 'system',
        content: `You are a helpful assistant.
            You will take into account any CONTEXT BLOCK
            that is provided in a conversation.
            START CONTEXT BLOCK
            ${context.map((c: any) => c.metadata.text).join("\n")}
            END OF CONTEXT BLOCK`,
    }]

    const newmessages = [...prompt, ...messages]

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        // stream: true,
        messages: newmessages || [],
    });
    // // Convert the response into a friendly text-stream
    // const stream = OpenAIStream(response);

    // // Respond with the stream
    // return new StreamingTextResponse(stream);
    return NextResponse.json({ message: response?.choices[0]?.message?.content })

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