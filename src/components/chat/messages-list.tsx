"use client";

import { Card } from "@/components/ui/card";
import ChatInput from "./chat-input";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "./message";


export interface IMessage {
    role: "user" | "system";
    content: string;
}

const ChatMessages = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [streamMessage, setStreamMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null);

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
        // if (response.status !== 200) throw new Error(response.status.toString());
        // if (!response.body) throw new Error("Response body does not exist");
        return response.json();
    };

    const handleAgentCall = async (data: IMessage[]) => {
        setIsLoading(true)
        let apiData = {
            messages: data
        }
        const response = await generateStream(apiData);
        setIsLoading(false)
        let message = {
            content: response?.message,
            role: "system",
        };
        setMessages((prev: any) => {
            return [...prev, message];
        });
        setStreamMessage("");
    }

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isLoading]);


    return (
        <>
            <div className="pb-[10px] pt-4 md:pt-10">
                <Card className="mx-auto max-w-2xl h-[450px] px-4">
                    <ScrollArea className="h-full rounded-md p-4" ref={scrollAreaRef}>
                        <div className="flex flex-col flex-1 gap-4">
                            {messages?.map((msg, index) => {
                                return (
                                    <>
                                        <Message index={index} msg={msg} />
                                    </>
                                );
                            })}
                        </div>
                        {
                            isLoading && <div className="flex justify-end">
                                <p className="bg-muted/50 text-sm px-4 py-2 rounded-lg  overflow-auto break-words max-w-xs">
                                    Loading ...
                                </p>
                            </div>
                        }
                    </ScrollArea>
                </Card>
            </div>

            <ChatInput messages={messages} setMessages={setMessages} handleAgentCall={handleAgentCall} />
        </>
    );
}


export default ChatMessages