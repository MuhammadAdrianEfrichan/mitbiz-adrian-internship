import { environment } from "../../constant/environment";


// READ — ambil semua user
export const getUsers = async () => {
    const res = await fetch(`${environment.API_URL}/superadmin/users`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};
export const getUserSummary = async (id) => {
    const res = await fetch(`${environment.API_URL}/superadmin/users/summary`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};

// CREATE — tambah user baru
export const createUsers = async (userData) => {
    const res = await fetch(`${environment.API_URL}/superadmin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menambah user");
    return data;
};

// UPDATE — edit user berdasarkan id
export const updateUsers = async (id, userData) => {
    const res = await fetch(`${environment.API_URL}/superadmin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah user");
    return data;
};

// DELETE — hapus user berdasarkan id
export const deleteUsers = async (id) => {
    const res = await fetch(`${environment.API_URL}/superadmin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus user");
    return data;
};