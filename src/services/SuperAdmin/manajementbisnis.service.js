import { environment } from "../../constant/environment";


// READ — ambil semua cabang
export const getBisnis = async () => {
    const res = await fetch(`${environment.API_URL}/superadmin/outlets`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};
export const getDetailBisnis = async (id) => {
    const res = await fetch(`${environment.API_URL}/superadmin/outlets/${id}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};

// CREATE — tambah cabang baru
export const createBisnis = async (bisnisData) => {
    const res = await fetch(`${environment.API_URL}/superadmin/outlets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bisnisData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah cabang");
    return data;
};

// UPDATE — edit cabang berdasarkan id
export const updateBisnis = async (id, bisnisData) => {
    const res = await fetch(`${environment.API_URL}/superadmin/outlets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bisnisData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

// DELETE — hapus cabang berdasarkan id
export const deleteBisnis = async (id) => {
    const res = await fetch(`${environment.API_URL}/superadmin/outlets/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};