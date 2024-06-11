import jwt from 'jsonwebtoken';
import api from '@/lib/api';


export default async function isAuthenticated(token: string | undefined): Promise<boolean> {
    if (!token) {
        console.error('No token provided');
        return false;
    }

    try {
        // Verify the token
        const decoded: any = jwt.decode(token); // Ensure JWT_SECRET_KEY is correctly defined
        if (decoded && typeof decoded === 'object' && decoded.email) {
            try {
                const response = await api.post('/auth', { email: decoded.email });
                return !!response.data.user
            } catch (apiError: any) {
                // Handle errors from the API call
                console.error(`Error fetching user from API: ${apiError.response?.status} - ${apiError.response?.data?.message || apiError.message}`);
                return false;
            }
        } else {
            console.error('Invalid token structure');
            return false;
        }
    } catch (error: any) {
        console.error('Error verifying token:', error.message);
        return false;
    }
}