import { environment } from "../../constant/environment";


// READ — ambil semua cabang milik bisnis user yang login
export const getCategory = async () => {
    const res = await fetch(`${environment.API_URL}/categories`, {
        method: "GET",
        credentials: "include",
    });
    console.log("Status:", res.status); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};

// CREATE — tambah cabang baru
export const createCategory = async (categoryData) => {
    const res = await fetch(`${environment.API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah cabang");
    return data;
};

// UPDATE — edit cabang berdasarkan id
export const updateCategory = async (id, categoryData) => {
    const res = await fetch(`${environment.API_URL}/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

// DELETE — hapus cabang berdasarkan id
export const deleteCategory = async (id) => {
    const res = await fetch(`${environment.API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};