"use client";

import { Toaster } from "../ui/toaster";
import { usePathname } from "next/navigation";
import NavBar from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            {" "}

            <Toaster />
            {pathname === "/login" || pathname === "/signup" ? (
                <>{children}</>
            ) : (
                <>
                    <div className="flex flex-col min-h-screen">
                        <NavBar />
                        <div className="flex flex-col flex-1 bg-muted/50">{children}</div>
                    </div>
                </>
            )}
        </>
    );
}
