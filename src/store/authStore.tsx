import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    email: string;
    firstName: string;
    lastName: string;
    _id: string;
};

type AuthStore = {
    user: User | null;
    setUser: (data: User | null) => void;
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (data) => set((state) => ({ user: data })),
        }),
        {
            name: "user-storage",
        }
    )
);

export default useAuthStore;
