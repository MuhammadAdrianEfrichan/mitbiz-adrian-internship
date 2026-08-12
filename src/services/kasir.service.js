import { environment } from "../constant/environment";

export const tambahKasir = async (formData) => {
    const res = await fetch(`${environment.API_URL}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials : "include",
        body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "menambahkan akun kasir gagal");
    }

    return data; 
};

export const getKasir = async () => {
    const res = await fetch(`${environment.API_URL}/staff`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};


export const updateKasir = async (id, branchData) => {
    const res = await fetch(`${environment.API_URL}/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(branchData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

export const deleteKasir = async (id) => {
    const res = await fetch(`${environment.API_URL}/staff/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};

export const searchKasir = async (search) => {
    const filter = search ? search.toLocaleLowerCase() : "";

    const url = filter
        ? `${environment.API_URL}/staff?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/staff`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
}