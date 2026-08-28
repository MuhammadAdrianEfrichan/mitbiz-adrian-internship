import { environment } from "../../constant/environment"; 
export const subscribeToPackage = async ({ packageId }) => {
	const res = await fetch(`${environment.API_URL}/subscriptions/subscribe`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ packageId }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "Gagal membuat transaksi pembayaran");
	return data;
};