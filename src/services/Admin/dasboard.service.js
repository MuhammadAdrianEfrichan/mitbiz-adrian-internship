import { environment } from "../../constant/environment";

export const getDasboard = async () => {
    const res = await fetch(`${environment.API_URL}/dashboard`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};