import { IMessage } from "./messages-list"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import useAuthStore from "@/store/authStore"



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
                            <div className="bg-muted/50 text-sm px-4 py-2 rounded-lg overflow-auto break-words max-w-xs">
                                {msg.content}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-end">
                            <p className="bg-muted/50 text-sm px-4 py-2 rounded-lg  overflow-auto break-words max-w-xs">
                                {msg.content}
                            </p>
                        </div>
                    </>
                )
            }
        </>
    )
}