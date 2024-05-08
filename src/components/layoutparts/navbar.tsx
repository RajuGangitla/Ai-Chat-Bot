"use client"

import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { toast } from "../ui/use-toast"


export default function NavBar() {
    const { data: session } = useSession()
    const handleSignout = () => {
        signOut()
        toast({
            title: "Logout successfully",
        })
    }


    return (
        <>
            <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0">
                <div className="flex items-center space-x-2">
                    {/* Image */}
                    <p className="text-lg font-semibold ">AI Chat Bot</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                {/* @ts-ignore */}
                                <AvatarImage src={session?.user?.image} alt="profile" />
                                <AvatarFallback>{session?.user?.name?.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignout} className="cursor-pointer">
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header >
        </>
    )
}