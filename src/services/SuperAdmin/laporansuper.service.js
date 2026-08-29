import { environment } from "../../constant/environment";

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

// Format Date jadi "YYYY-MM-DD" sesuai yang diminta backend.
const toDateString = (date) => date.toISOString().slice(0, 10);

// Kalau caller tidak mengirim startDate/endDate, default ke 30 hari terakhir
// supaya request tidak pernah gagal karena parameter wajib ini kosong.
const withDefaultDateRange = (params = {}) => {
    if (params.startDate && params.endDate) return params;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
        ...params,
        startDate: params.startDate ?? toDateString(startDate),
        endDate: params.endDate ?? toDateString(endDate),
    };
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

// Sales & Products WAJIB startDate/endDate — pakai default 30 hari terakhir kalau tidak diisi.
export const getProductsReport = (params = {}) => getReport("/reports/products", withDefaultDateRange(params));
export const getSalesReport = (params = {}) => getReport("/reports/sales", withDefaultDateRange(params));

// Stok bersifat snapshot (tidak butuh rentang tanggal), jadi tidak perlu default.
export const getStocksReport = (params = {}) => getReport("/reports/stocks", params);

export const downloadSalesReport = async (params = {}) => {
    const finalParams = withDefaultDateRange(params);
    const response = await fetch(`${environment.API_URL}/reports/sales/export${buildQuery(finalParams)}`, {
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