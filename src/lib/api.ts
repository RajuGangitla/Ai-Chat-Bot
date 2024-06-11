import axios from "axios";



const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Origin": "*",
    }
})

export default api 