"use client";

import { useEffect, ComponentType, FC } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

// Define the props type
interface AuthGuardProps {
    // Add any specific props you expect your components to receive
}

// Higher-Order Component (HOC)
const AuthGuard = <P extends AuthGuardProps>(WrappedComponent: ComponentType<P>): FC<P> => {
    const Wrapper: FC<P> = (props) => {
        const router = useRouter();
        const { user } = useAuthStore(); // Example check
        console.log(user, "user")
        useEffect(() => {
            if (!user) {
                router.push('/login');
            }
        }, [user, router]);

        // If user is not authenticated, don't render the wrapped component
        if (!user) {
            return null;
        }

        // If user is authenticated, render the wrapped component
        return <WrappedComponent {...props} />;
    };

    Wrapper.displayName = `AuthGuard(${getDisplayName(WrappedComponent)})`;

    return Wrapper;
};

// Helper function to get the display name of the wrapped component
function getDisplayName<P>(WrappedComponent: ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default AuthGuard;