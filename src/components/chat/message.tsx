import { IMessage } from "./messages-list"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import useAuthStore from "@/store/authStore"
import MarkdownRenderer from "./markdown"



interface IMessageProps {
    index: number
    msg: IMessage
}

export default function Message({ index, msg }: IMessageProps) {
    const { user } = useAuthStore()
    return (
        <>
            {
                msg.role === "user" ? (
                    <>
                        <div className="flex gap-2">
                            <div className="">
                                <Avatar className="h-8 w-8">
                                    {/* @ts-ignore */}
                                    <AvatarImage src={user?.image} alt="profile" />
                                    <AvatarFallback>{user?.firstName?.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="bg-muted/50 text-sm px-4 py-2 rounded-lg overflow-auto break-words ">
                                {msg.content}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2">
                            <div className="">
                                <Avatar className="h-8 w-8">
                                    {/* @ts-ignore */}
                                    <AvatarImage src={"./chat-bot.jpg"} alt="profile" />
                                    <AvatarFallback>{user?.firstName?.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="bg-muted/50 text-sm px-4 py-2 rounded-lg overflow-auto break-words ">
                                <MarkdownRenderer message={msg.content} />
                            </p>

                        </div>
                    </>
                )
            }
        </>
    )
}