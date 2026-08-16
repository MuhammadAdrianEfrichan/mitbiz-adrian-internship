import { environment } from "../constant/environment";

export const createRoles = async (formData) => {
    const res = await fetch(`${environment.API_URL}/roles`, {
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

export const getRoles = async () => {
    const res = await fetch(`${environment.API_URL}/roles`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};


export const updateRoles = async (id, branchData) => {
    const res = await fetch(`${environment.API_URL}/roles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(branchData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah cabang");
    return data;
};

export const deleteRoles = async (id) => {
    const res = await fetch(`${environment.API_URL}/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};

export const searchRoles = async (search) => {
    const filter = search ? search.toLocaleLowerCase() : "";

    const url = filter
        ? `${environment.API_URL}/roles?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/roles`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
}