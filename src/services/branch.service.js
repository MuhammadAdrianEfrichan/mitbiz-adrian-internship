import { environment } from "../constant/environment";

// READ — ambil semua cabang milik bisnis user yang login
export const getBranches = async () => {
    const res = await fetch(`${environment.API_URL}/branches`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};

// CREATE — tambah cabang baru
export const createBranch = async (branchData) => {
    const res = await fetch(`${environment.API_URL}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(branchData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah cabang");
    return data;
};

// UPDATE — edit cabang berdasarkan id
export const updateBranch = async (id, branchData) => {
    const res = await fetch(`${environment.API_URL}/outlets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(branchData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

// DELETE — hapus cabang berdasarkan id
export const deleteBranch = async (id) => {
    const res = await fetch(`${environment.API_URL}/outlets/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};