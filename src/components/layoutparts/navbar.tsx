"use client"

import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/authStore"
import { toast } from "../ui/use-toast"
import { ErrorResponse } from "@/types/signup"
import axios, { AxiosError } from "axios"


export default function NavBar() {

    const { user, setUser } = useAuthStore()
    const router = useRouter()
    async function logoutApi() {
        const response = await api.post('/logout')
        return response.data
    }

    const { mutate, isPending } = useMutation({
        mutationFn: logoutApi,
        onSuccess: (res) => {
            router.push("/login")
            setUser(null)
            toast({
                title: "Logout Successfully"
            })
        },
        onError: (error: AxiosError) => {
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorResponse = error.response.data as ErrorResponse; // Type assertion
                toast({
                    title: errorResponse.message,
                });
                console.log(errorResponse.message, "error");
            }
        },
    })

    const handleClick = () => {
        if (!isPending) {
            mutate()
        }
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
                                <AvatarImage src={user?.image} alt="profile" />
                                <AvatarFallback>{user?.firstName?.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.firstName + " " + user?.lastName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
                            {isPending ? 'Logging out...' : 'Logout'}
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header >
        </>
    )
}