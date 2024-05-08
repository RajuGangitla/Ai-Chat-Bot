"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession, signIn, signOut } from "next-auth/react"
import { toast } from "../ui/use-toast";



export default function Login() {
    const { data: session } = useSession()
    const router = useRouter()

    if (session) {
        toast({
            title: "Login successfully",
        })
        router.push("/")
    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <Button className="bg-white" onClick={() => signIn('google')}>
                    Continue with google
                </Button>
            </div>
        </>
    )
}