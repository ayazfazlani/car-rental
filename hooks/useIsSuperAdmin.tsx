import { useEffect, useState } from "react"

export function useIsSuperAdmin() {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return
        const fetchData = async () => {
            const decryptedToken = await decodeJWT(token)
            if (!decryptedToken) return
            if (decryptedToken.role === 'SUPER_ADMIN') {
                setIsSuperAdmin(true)
            }
        }
        fetchData()
    }, [])

    return isSuperAdmin
}
const decodeJWT = (token: string) => {
    try {
        // Split the token into its parts: header, payload, and signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token specified: missing parts');
        }

        // Decode the payload (the second part)
        // Base64Url uses '-' and '_' instead of '+' and '/' used in standard Base64
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // Use atob to decode the Base64 string
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);

    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
};