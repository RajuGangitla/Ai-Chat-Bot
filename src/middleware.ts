import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import isAuthenticated from './middleware/api/api-middleware';

export async function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
        return NextResponse.json({ error: 'Unauthorized', message: 'Missing authentication token' }, { status: 401 });
    }

    const authenticated = await isAuthenticated(authToken);

    if (authenticated) {
        return NextResponse.next();
    } else {
        return NextResponse.json({ error: 'Unauthorized', message: 'Invalid authentication token' }, { status: 401 });
    }
}