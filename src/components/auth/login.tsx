"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ErrorResponse, IloginForm } from "@/types/signup";
import axios, { AxiosError } from "axios";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import ReusableFormRow from "../ui/reusable-formrow";
import ReusableInput from "../ui/reusable-input";

export default function Login() {

    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<IloginForm>();


    const onSubmit = handleSubmit(async (data: IloginForm) => {
        const newData: any = { ...data }
        await axios.get("/api/auth", newData).then((res) => {
            toast({
                title: "Login Successfully"
            })
            router.push("/")
        }).catch((err: AxiosError) => {
            if (axios.isAxiosError(err) && err.response?.data) {
                const errorResponse = err.response.data as ErrorResponse; // Type assertion
                toast({
                    title: errorResponse.message,
                });
                console.log(errorResponse.message, "error");
            }
        })
    })

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
                    <div className="grid gap-4">

                        <form onSubmit={(e: FormEvent) => {
                            e.preventDefault()
                            onSubmit(e)
                        }}></form>
                        <div className="grid gap-2">
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
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
