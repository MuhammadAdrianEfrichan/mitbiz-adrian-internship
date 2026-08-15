import { environment } from "../constant/environment";


// READ — ambil semua cabang milik bisnis user yang login
export const getPenstok = async () => {
    const res = await fetch(`${environment.API_URL}/stocks/adjustments`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Penyesuaian Stok");
    return data;
};

// CREATE — tambah cabang baru
export const createPenstok = async (penstokData) => {
    console.log("BODY YANG BENAR-BENAR DIKIRIM:", JSON.stringify(penstokData));
    const res = await fetch(`${environment.API_URL}/stocks/adjust`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(penstokData),
    });
    const data = await res.json();
    console.log("RESPONSE DARI SERVER:", data);
    if (!res.ok) throw new Error(data.message || "Gagal menambah pembayran");
    return data;
};

// search
export const searchPenstok = async (search) => {
    const filter = search ? search.toLocaleLowerCase() : "";

    const url = filter
        ? `${environment.API_URL}/stocks/adjustments?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/stocks/adjustments`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};

export const categoryPenStok = async (outletId) => {
    let url = `${environment.API_URL}/stocks/adjustments`
    if(outletId){
        url+= `?outletId=${encodeURIComponent(outletId)}`;
    }

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};

export const searchPenStok = async (search) => {
    const filter = search ? search.toLocaleLowerCase() : "";

    const url = filter
        ? `${environment.API_URL}/stocks/adjustments?search=${encodeURIComponent(filter)}`
        : `${environment.API_URL}/stocks/adjustments`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data produk");
    return data;
};