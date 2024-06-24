"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { SetStateAction, useState } from "react";
import React from "react";
import { IMessage } from "./messages-list";
import FileUpload from "../fileupload";


export interface IChatInputProps {
    messages: IMessage[];
    setMessages: React.Dispatch<SetStateAction<IMessage[]>>;
    handleAgentCall: (messages: IMessage[]) => void
}

export default function ChatInput({
    messages,
    setMessages,
    handleAgentCall,
}: IChatInputProps) {

    const [input, setInput] = useState<string>('')



    const handleSubmit = async () => {
        const newMessage: IMessage = { role: "user", content: input };
        const updatedMessages = [...messages, newMessage];

        // Update the messages state
        setMessages(updatedMessages);

        // Call handleAgentCall with the updated messages array
        handleAgentCall(updatedMessages);

        // Clear the user input field
        setInput('');
    }


    return (
        <>
            <div className="pt-8 mx-auto max-w-2xl">
                <div className="relative border-2 border-gray-400 rounded-lg">
                    <Textarea
                        tabIndex={0}
                        // onKeyDown={onKeyDown}
                        placeholder="Send a message."
                        className="relative min-h-[60px] w-[85%] focus-visible:outline-none resize-none border-none bg-transparent px-4 py-[1.3rem] sm:text-sm"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        name="message"
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="flex items-center gap-2 absolute right-0 bottom-3 mr-1">
                        <FileUpload />
                        <Button
                            className=""
                            onClick={handleSubmit}
                            disabled={input.length === 0}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
