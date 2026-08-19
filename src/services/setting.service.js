import { environment } from "../constant/environment";

export const getSetting = async () => {
    const res = await fetch(`${environment.API_URL}/admin/settings/business`, {
        method: "GET",
        credentials: "include",
    }); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil informasi bisnis");
    return data;
};

export const updateBusinessSetting = async (payload) => {
    const res = await fetch(`${environment.API_URL}/admin/settings/business`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menyimpan pengaturan bisnis");
    return data;
};