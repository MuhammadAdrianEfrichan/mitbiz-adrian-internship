import { environment } from "../constant/environment";

export const getSetting = async () => {
    const res = await fetch(`${environment.API_URL}/settings`, {
        method: "GET",
        credentials: "include",
    }); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};