"use client"

import NavBar from "@/components/layoutparts/navbar"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {

    const pathname = usePathname()
    const { data: session } = useSession()
    const router = useRouter()

    console.log("user", session?.user)

    // useEffect(() => {
    //     if (session?.user) {
    //         router.push("/")
    //     } else {
    //         router.push("/login")
    //     }
    // }, [pathname])

    return (
        <>
            {
                pathname === "/login" || pathname === "/signup" ? (
                    <>
                        {children}
                    </>
                ) : (
                    <>
                        <div className="flex flex-col min-h-screen">
                            <NavBar />
                            <div className="flex flex-col flex-1 bg-muted/50">
                                {children}
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}