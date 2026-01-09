export function authHeader(): Record<string, string> {
    const token = localStorage.getItem("token");

    if (!token) return {};

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}
