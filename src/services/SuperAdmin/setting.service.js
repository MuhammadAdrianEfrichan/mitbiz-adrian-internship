import { environment } from "../../constant/environment"; // sesuaikan path

export const getGlobalSettings = async () => {
	const res = await fetch(`${environment.API_URL}/settings`, {
		method: "GET",
		credentials: "include",
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "Gagal mengambil pengaturan sistem");
	return data;
};

export const updateGlobalSettings = async (payload) => {
	const res = await fetch(`${environment.API_URL}/settings`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "Gagal menyimpan pengaturan sistem");
	return data;
};

// PLACEHOLDER — menunggu spek endpoint upload logo dari kamu.
// Setelah ada, ganti isi fungsi ini dengan fetch ke endpoint upload yang sebenarnya,
// dan pastikan return value-nya berupa URL string (logoUrl) hasil upload.
export const uploadLogo = async (file) => {
	throw new Error("Endpoint upload logo belum tersedia. Hubungi backend untuk spesifikasinya.");
};