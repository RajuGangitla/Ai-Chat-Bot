import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import isAuthenticated from './middleware/api/api-middleware';

export const config = {
    matcher: ['/api/auth', '/', '/api/uploadFiles'],
}

export async function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
        const url = new URL('/login', request.nextUrl.origin); // Create an absolute URL
        return NextResponse.redirect(url);
    }

    const { isValidated, userId } = await isAuthenticated(authToken);

    if (isValidated) {
        const response = NextResponse.next();
        response.headers.set('x-user-id', userId);
        return response;
    } else {
        const url = new URL('/login', request.nextUrl.origin); // Create an absolute URL
        return NextResponse.redirect(url);
    }
}