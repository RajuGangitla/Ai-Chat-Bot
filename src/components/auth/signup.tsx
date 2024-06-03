"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { FormEvent } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import ReusableFormRow from "../ui/reusable-formrow";
import ReusableInput from "../ui/reusable-input";
import { ISignUpForm, UserSchema } from "@/types/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios"

export default function SignUp() {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ISignUpForm>({
        resolver: zodResolver(UserSchema)
    });


    const onSubmit = handleSubmit(async (data: ISignUpForm) => {
        const newData: any = { ...data }
        await axios.post("/api/user", newData).then((res) => {
            console.log(res, "res")
        }).catch((err) => {
            console.log(err.message, "errr")
        })
        console.log(newData)
    });

    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e: FormEvent) => {
                            e.preventDefault();
                            onSubmit(e);
                        }}>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <ReusableFormRow
                                            label={"First name"}
                                            required={true}
                                            errors={errors.firstName}
                                            name={"firstName"}
                                        >
                                            <ReusableInput<ISignUpForm>
                                                control={control}
                                                name={"firstName"}
                                                required={true}
                                                placeholder={"Enter first name "}
                                                type={"text"}
                                            />
                                        </ReusableFormRow>
                                    </div>
                                    <div className="grid gap-2">
                                        <ReusableFormRow
                                            label={"Last name"}
                                            required={true}
                                            errors={errors.lastName}
                                            name={"lastName"}
                                        >
                                            <ReusableInput<ISignUpForm>
                                                control={control}
                                                name={"lastName"}
                                                required={true}
                                                placeholder={"Enter last name "}
                                                type={"text"}
                                            />
                                        </ReusableFormRow>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <ReusableFormRow
                                        label={"Email"}
                                        required={true}
                                        errors={errors.email}
                                        name={"email"}
                                    >
                                        <ReusableInput<ISignUpForm>
                                            control={control}
                                            name={"email"}
                                            required={true}
                                            placeholder={"Enter mail"}
                                            type={"email"}
                                        />

                                    </ReusableFormRow>
                                </div>
                                <div className="grid gap-2">
                                    <ReusableFormRow
                                        label={"Password"}
                                        required={true}
                                        errors={errors.password}
                                        name={"password"}
                                    >
                                        <ReusableInput<ISignUpForm>
                                            control={control}
                                            name={"password"}
                                            required={true}
                                            placeholder={"Enter password"}
                                            type={"password"}
                                        />
                                    </ReusableFormRow>
                                </div>
                                <Button type="submit" className="w-full">
                                    Create an account
                                </Button>
                            </div>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
