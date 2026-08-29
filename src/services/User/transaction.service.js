import { environment } from "../../constant/environment";

export const createTransactions = async (payload) => {
    const res = await fetch(`${environment.API_URL}/transactions`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menyimpan transaksi");
    return data;
};

export const getTransaction = async (params = {}) => {
    const qs = params && Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : "";
    const res = await fetch(`${environment.API_URL}/transactions${qs}`, {
        method: "GET",
        credentials: "include",
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Pembayaran");
    if (data.success && data.data === null && Number(data.total ?? 0) > 0) {
        throw new Error(`API menemukan ${data.total} transaksi, tetapi tidak mengirim detail transaksinya.`);
    }
    return data;
};

export const getPajak= async () => {
    const res = await fetch(`${environment.API_URL}/pos/config`, {
        method: "GET",
        credentials: "include",
    });
    console.log("Status pajak:", res.status); 
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Pembayaran");
    return data;
};

export const getMetodePembayaran= async (id) => {
    const res = await fetch(`${environment.API_URL}/outlets/${id}/payment-methods`, {
        method: "GET",
        credentials: "include",
    });     
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data Pembayaran");
    return data;
};

export const getTransactionDetail = async (id) => {
	const res = await fetch(`${environment.API_URL}/transactions/${id}`, {
		method: "GET",
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "Gagal mengambil detail transaksi");
	return data;
};