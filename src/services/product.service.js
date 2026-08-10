import { environment } from "../constant/environment";


export const getProduct = async () => {
    const res = await fetch(`${environment.API_URL}/products`, {
        method: "GET",
        credentials: "include",
    });
    console.log("Status:", res.status); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data cabang");
    return data;
};

// CREATE — tambah cabang baru
export const createProduct = async (productData) => {
    const res = await fetch(`${environment.API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah cabang");
    return data;
};

// UPDATE — edit cabang berdasarkan id
export const updateProduct = async (id, productData) => {
    const res = await fetch(`${environment.API_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

// DELETE — hapus cabang berdasarkan id
export const deleteProduct = async (id) => {
    const res = await fetch(`${environment.API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};