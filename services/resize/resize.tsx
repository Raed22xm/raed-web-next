import {resizeData} from '@/interfaces'
import axios from 'axios'

// Helper function to get access token from localStorage
function getAccessToken(): string {
    if (typeof window !== 'undefined') {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            try {
                const parsedUserData = JSON.parse(storedUserData);
                return parsedUserData?.accessToken || "";
            } catch (error) {
                console.error("Failed to parse userData from localStorage", error);
            }
        }
    }
    return "";
}

// Helper function to get headers with Authorization
function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    const accessToken = getAccessToken();
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
}

async function createResize(payload: resizeData) {
    try {
        const headers = getAuthHeaders();

        const response = await axios.post(
            process.env.NEXT_PUBLIC_API_URL + "/resize/resizeImg",
            payload,
            { headers }
        );
        return response;
    } catch (error) {
        console.error("Resize failed", error);
        throw error;
    }
}

async function getAllResizes(userId: string) {
    try {
        const headers = getAuthHeaders();

        const response = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + `/resize/all/${userId}`,
            { headers }
        );
        return response;
    } catch (error) {
        console.error("Failed to fetch resizes", error);
        throw error;
    }
}

async function deleteResize(resizeId: string) {
    try {
        const headers = getAuthHeaders();

        const response = await axios.delete(
            process.env.NEXT_PUBLIC_API_URL + `/resize/${resizeId}`,
            { headers }
        );
        return response;
    } catch (error) {
        console.error("Failed to delete resize", error);
        throw error;
    }
}

export { createResize, getAllResizes, deleteResize };