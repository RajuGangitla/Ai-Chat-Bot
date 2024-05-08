
import AuthGuard from "@/guards/auth-guard";
import { Toaster } from "../ui/toaster";



export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <AuthGuard>
                <Toaster />
                {children}
            </AuthGuard>
        </>
    )
}