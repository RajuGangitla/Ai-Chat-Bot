"use client";

import { Card } from "@/components/ui/card";
import ChatInput from "./chat-input";
import { useState } from "react";
import { Bot, CircleUserRound } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthGuard from "@/middleware/client/auth-guard";

export interface IMessage {
    role: "user" | "system";
    content: string;
}

const ChatMessages = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    return (
        <>
            <div className="pb-[10px] pt-4 md:pt-10">
                <Card className="mx-auto max-w-2xl h-[450px] px-4">
                    <ScrollArea className="h-full rounded-md p-4">
                        <div className="flex flex-col flex-1 space-x-4">
                            {messages?.map((msg, index) => {
                                return (
                                    <>
                                        <div key={index} className="flex items-start p-2 space-x-2">
                                            <div className="">
                                                {msg.role === "user" ? (
                                                    <CircleUserRound size={32} />
                                                ) : (
                                                    <Bot size={32} />
                                                )}
                                            </div>
                                            <div className="">
                                                {msg.role === "user" ? (
                                                    <p className="text-sm">Customer</p>
                                                ) : (
                                                    <p className="text-sm">ChatBot</p>
                                                )}
                                                <p className="text-sm overflow-auto break-words">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            <ChatInput messages={messages} setMessages={setMessages} />
        </>
    );
}


export default AuthGuard(ChatMessages)
// export default ChatMessages