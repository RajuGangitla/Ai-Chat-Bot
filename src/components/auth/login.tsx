"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ErrorResponse, ILoginApiResponse, IloginForm, LoginSchema } from "@/types/signup";
import axios, { AxiosError } from "axios";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import ReusableFormRow from "../ui/reusable-formrow";
import ReusableInput from "../ui/reusable-input";
import useAuthStore from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<IloginForm>({
        resolver: zodResolver(LoginSchema)
    });

    async function postLoginData(data: IloginForm): Promise<ILoginApiResponse> {
        const response = await api.post("/login", data);
        return response.data;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: postLoginData,
        onSuccess: (data: any) => {
            toast({
                title: "Login Successfully",
            });
            console.log(data, "data");
            setUser(data.user);
            router.push("/");
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
    });

    const onSubmit = handleSubmit(async (data: IloginForm) => {
        const newData: any = { ...data };
        mutate(newData);
    });

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 ">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <form
                        onSubmit={(e: FormEvent) => {
                            e.preventDefault();
                            onSubmit(e);
                        }}
                    >
                        <div className="grid gap-4">
                            <ReusableFormRow
                                label={"Email"}
                                required={true}
                                errors={errors.email}
                                name={"email"}
                            >
                                <ReusableInput<IloginForm>
                                    control={control}
                                    name={"email"}
                                    required={true}
                                    placeholder={"Enter mail"}
                                    type={"email"}
                                />
                            </ReusableFormRow>
                            <ReusableFormRow
                                label={"Password"}
                                required={true}
                                errors={errors.password}
                                name={"password"}
                            >
                                <ReusableInput<IloginForm>
                                    control={control}
                                    name={"password"}
                                    required={true}
                                    placeholder={"Enter password"}
                                    type={"password"}
                                />
                            </ReusableFormRow>
                        </div>
                        <Button disabled={isPending} type="submit" className="w-full mt-4">
                            {isPending ? (
                                <Loader className="mr-2 animate-spin h-4 w-4" />
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="w-full h-screen hidden bg-muted lg:block">
                <img
                    src="/login-2.jpg"
                    alt="Image"
                    className="h-full w-full object-cover rounded-lg"
                />
                {/* <Image
                    src="/login-3.png"
                    alt="Image"
                    width="1920"
                    height="1080"
                /> */}
            </div>
        </div>
    );
}
