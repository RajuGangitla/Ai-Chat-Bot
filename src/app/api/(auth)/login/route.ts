import connectDb from "@/config/db";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

interface JwtPayload {
    userId: string;
    email: string;
}



export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        await connectDb();

        if (!body.email || !body.password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }


        const findUser = await Users.findOne({ email: body.email })

        if (findUser) {
            const isPasswordMatched = await bcrypt.compare(body.password, findUser.password);
            console.log(isPasswordMatched, "isPasswordMatched")
            if (isPasswordMatched) {
                const payload: JwtPayload = {
                    userId: findUser._id.toString(),
                    email: findUser.email,
                };
                const user = await Users.findOne({ email: body.email }).select('-password')
                // Create JWT
                const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

                // Set cookie
                const serializedCookie = serialize('authToken', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 5 * 60 * 60, // 1 hour
                    path: '/',
                });


                return NextResponse.json({ message: "User created successfully", user: user }, {
                    status: 200,
                    headers: {
                        'Set-Cookie': serializedCookie,
                    }
                });

            } else {
                return NextResponse.json({ message: "Password is incorrect" }, { status: 401 });
            }
        }
        else {
            return NextResponse.json({ error: "NO User found", status: 404 })
        }
    } catch (error: any) {
        console.error("Error in creating user:", error);
        return NextResponse.json({ error: "Error in creating user", message: error?.message }, { status: 500 });
    }
}
