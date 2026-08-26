import { environment } from "../../constant/environment";


// READ — ambil semua cabang milik bisnis user yang login
export const getPembayaran = async () => {
    const res = await fetch(`${environment.API_URL}/payment-methods`, {
        method: "GET",
        credentials: "include",
    });
    console.log("Status:", res.status); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Pembayaran");
    return data;
};

// CREATE — tambah cabang baru
export const createPembayaran = async (pembayaranData) => {
    console.log("BODY YANG BENAR-BENAR DIKIRIM:", JSON.stringify(pembayaranData));
    const res = await fetch(`${environment.API_URL}/payment-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pembayaranData),
    });
    const data = await res.json();
    console.log("RESPONSE DARI SERVER:", data);
    if (!res.ok) throw new Error(data.message || "Gagal menambah pembayran");
    return data;
};

// UPDATE — edit cabang berdasarkan id
export const updatePembayaran = async (id, pembayaranData) => {
    const res = await fetch(`${environment.API_URL}/payment-methods/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pembayaranData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah pembayaran");
    return data;
};

// DELETE — hapus cabang berdasarkan id
export const deletePembayaran = async (id) => {
    const res = await fetch(`${environment.API_URL}/payment-methods/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus cabang");
    return data;
};

// search
export const searchPembayaran = async (search) => {
    const filter = search ? search.toLocaleLowerCase() : "";

    const url = filter
        ? `${environment.API_URL}/payment-methods?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/payment-methods`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};