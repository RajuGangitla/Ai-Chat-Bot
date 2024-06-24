"use client";

import { Card } from "@/components/ui/card";
import ChatInput from "./chat-input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "./message";
import api from "@/lib/api";

export interface IMessage {
    role: "user" | "system";
    content: string;
}

const ChatMessages = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [streamMessage, setStreamMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false)


    async function* getIterableStream(
        body: ReadableStream<Uint8Array>
    ): AsyncIterable<string> {
        const reader = body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            const decodedChunk = decoder.decode(value, { stream: true });
            yield decodedChunk;
        }
    }

    const generateStream = async (data: any) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        if (response.status !== 200) throw new Error(response.status.toString());
        if (!response.body) throw new Error("Response body does not exist");
        return getIterableStream(response.body);
    };

    const handleAgentCall = async (data: IMessage[]) => {
        setIsLoading(true)
        let apiData = {
            messages: data
        }
        const stream = await generateStream(apiData);
        let fullMessage = ""
        for (const chunk of stream) {
            fullMessage += chunk;
            setStreamMessage((prev) => prev + chunk);
        }
        setIsLoading(false)
        let message = {
            content: fullMessage,
            role: "system",
        };
        setMessages((prev: any) => {
            return [message, ...prev];
        });
        setStreamMessage("");
    }


    return (
        <>
            <div className="pb-[10px] pt-4 md:pt-10">
                <Card className="mx-auto max-w-2xl h-[450px] px-4">
                    <ScrollArea className="h-full rounded-md p-4">
                        <div className="flex flex-col flex-1 gap-4">
                            {messages?.map((msg, index) => {
                                return (
                                    <>
                                        <Message index={index} msg={msg} />
                                    </>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            <ChatInput messages={messages} setMessages={setMessages} handleAgentCall={handleAgentCall} />
        </>
    );
}


// export default AuthGuard(ChatMessages)
export default ChatMessages