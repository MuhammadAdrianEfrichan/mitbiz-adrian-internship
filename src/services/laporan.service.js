import { environment } from "../constant/environment";

const buildQuery = (params = {}) => {
	const query = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			query.set(key, value);
		}
	});

	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
};

const parseResponse = async (response) => {
	const contentType = response.headers.get("content-type") ?? "";
	const data = contentType.includes("application/json")
		? await response.json()
		: await response.blob();

	if (!response.ok) {
		const message = data?.message ?? "Gagal mengambil laporan";
		throw new Error(message);
	}

	return data;
};

const getReport = async (path, params) => {
	const response = await fetch(`${environment.API_URL}${path}${buildQuery(params)}`, {
		method: "GET",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	});

	return parseResponse(response);
};

export const getProductsReport = (params = {}) => getReport("/reports/products", params);
export const getStocksReport = (params = {}) => getReport("/reports/stocks", params);

export const downloadSalesReport = async (params = {}) => {
	const response = await fetch(`${environment.API_URL}/reports/sales/export${buildQuery(params)}`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		let message = "Gagal mengunduh laporan penjualan";
		try {
			const data = await response.json();
			message = data.message ?? message;
		} catch {
			// Response bukan JSON, gunakan pesan default.
		}
		throw new Error(message);
	}

	return response.blob();
};