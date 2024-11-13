import jwt from 'jsonwebtoken';
import api from '@/lib/api';

type TisAuthenticated = {
    userId: string
    isValidated: boolean
}

export default async function isAuthenticated(token: string | undefined): Promise<TisAuthenticated> {
    let isValidated = false
    if (!token) {
        console.error('No token provided');
        return { userId: '', isValidated: false };
    }

    try {
        // Verify the token
interface DecodedToken { email: string; } const decoded: DecodedToken | null = jwt.decode(token);
        if (decoded && typeof decoded === 'object' && decoded.email) {
            try {
                const response = await api.post('/auth', { email: decoded.email });
                return { userId: response.data.user._id, isValidated: !!response.data.user };
            } catch (apiError: any) {
                // Handle errors from the API call
                console.error(`Error fetching user from API: ${apiError.response?.status} - ${apiError.response?.data?.message || apiError.message}`);
                return { userId: '', isValidated: false };
            }
        } else {
            console.error('Invalid token structure');
            return { userId: '', isValidated: false };
        }
    } catch (error: any) {
        console.error('Error verifying token:', error.message);
        return { userId: '', isValidated: false };
    }
}