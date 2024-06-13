import { serialize } from "cookie";
import { NextResponse } from "next/server"




export const POST = async (req: Request) => {
    try {
        // Set cookie
        const serializedCookie = serialize('authToken', "", {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        });


        return NextResponse.json({ message: "logout Successfully" }, {
            status: 200,
            headers: {
                'Set-Cookie': serializedCookie,
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Error in logging out user", message: error.message }, { status: 500 })
    }
}