import { environment } from "../constant/environment";

export const getStocks = async () => {
    const res = await fetch(`${environment.API_URL}/stocks`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Penyesuaian Stok");
    return data;
};