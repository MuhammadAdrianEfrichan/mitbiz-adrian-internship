import { environment } from "../constant/environment";

export const getShiftActive = async () => {
    const res = await fetch(`${environment.API_URL}/shifts/active`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};
export const getShiftToday = async () => {
    const res = await fetch(`${environment.API_URL}/shifts/today-stats`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};

export const getShiftOpen = async () => {
    const res = await fetch(`${environment.API_URL}/shifts/open`, {
        method: "POST",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};
export const getShiftClose = async () => {
    const res = await fetch(`${environment.API_URL}/shifts/${id}/close`, {
        method: "PATCH",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};