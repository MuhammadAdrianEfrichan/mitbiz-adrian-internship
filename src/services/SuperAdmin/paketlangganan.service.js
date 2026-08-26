import { environment } from "../../constant/environment";


// READ — ambil semua Paket Langganan
export const getLangganan = async () => {
    const res = await fetch(`${environment.API_URL}/packages`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Paket Langganan");
    return data;
};
export const getDetailLangganan = async (id) => {
    const res = await fetch(`${environment.API_URL}/packages/${id}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Paket Langganan");
    return data;
};

// CREATE — tambah Paket Langganan baru
export const createLangganan = async (langgananData) => {
    const res = await fetch(`${environment.API_URL}/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(langgananData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah Paket Langganan");
    return data;
};

// UPDATE — edit Paket Langganan berdasarkan id
export const updateLangganan = async (id, langgananData) => {
    const res = await fetch(`${environment.API_URL}/packages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(langgananData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah Paket Langganan");
    return data;
};

// DELETE — hapus Paket Langganan berdasarkan id
export const deleteLangganan = async (id) => {
    const res = await fetch(`${environment.API_URL}/packages/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus Paket Langganan");
    return data;
};