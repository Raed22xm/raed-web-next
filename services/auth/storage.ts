// Utilities for reading auth-related data from localStorage in a tolerant way.
function safeParseUserData(raw: string | null): unknown {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to parse userData from localStorage", error);
        return null;
    }
}

function extractToken(data: unknown): string {
    if (!data || typeof data !== "object") {
        return "";
    }

    const record = data as Record<string, unknown>;

    const directAccessToken = record.accessToken;
    if (typeof directAccessToken === "string" && directAccessToken.trim()) {
        return directAccessToken.trim();
    }

    const directToken = record.token;
    if (typeof directToken === "string" && directToken.trim()) {
        return directToken.trim();
    }

    const nestedData = record.data;
    if (nestedData && typeof nestedData === "object") {
        const nested = extractToken(nestedData);
        if (nested) {
            return nested;
        }
    }

    return "";
}

function extractUserId(data: unknown): string {
    if (!data || typeof data !== "object") {
        return "";
    }

    const record = data as Record<string, unknown>;
    const userCandidates = [record.user, (record.data as Record<string, unknown> | undefined)?.user];
    for (const candidate of userCandidates) {
        if (candidate && typeof candidate === "object") {
            const user = candidate as Record<string, unknown>;
            const id = (user._id as string | undefined) ?? (user.id as string | undefined);
            if (typeof id === "string" && id.trim()) {
                return id.trim();
            }
        }
    }

    const nestedData = record.data;
    if (nestedData && typeof nestedData === "object") {
        const nested = extractUserId(nestedData);
        if (nested) {
            return nested;
        }
    }

    return "";
}

export function getStoredUserData(): unknown {
    if (typeof window === "undefined") {
        return null;
    }
    const raw = window.localStorage.getItem("userData");
    return safeParseUserData(raw);
}

export function getAccessToken(): string {
    const data = getStoredUserData();
    return extractToken(data);
}

export function getUserId(): string {
    const data = getStoredUserData();
    return extractUserId(data);
}
