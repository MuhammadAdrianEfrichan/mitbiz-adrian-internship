import { environment } from "../constant/environment";


// READ — ambil semua cabang milik bisnis user yang login
export const getPenstok = async () => {
    console.log("RAW RESPONSE:", res);
    console.log("res.data:", res.data);
    console.log("res.data.data:", res.data?.data);
    const res = await fetch(`${environment.API_URL}/stocks/adjustments`, {
        method: "GET",
        credentials: "include",
    });
    console.log("Status:", res.status); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Penyesuaian Stok");
    return data;
};

// CREATE — tambah cabang baru
export const createPenstok = async (penstokData) => {
    console.log("BODY YANG BENAR-BENAR DIKIRIM:", JSON.stringify(pembayaranData));
    const res = await fetch(`${environment.API_URL}/stocks/adjust`, {
        method: "PATCH",
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
    const res = await fetch(`${environment.API_URL}/stocks/adjus/${id}`, {
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
    const res = await fetch(`${environment.API_URL}/stocks/adjus/${id}`, {
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
        ? `${environment.API_URL}/stocks/adjus?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/stocks/adjus`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};