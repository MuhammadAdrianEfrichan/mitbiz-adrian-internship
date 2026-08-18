import { environment } from "../constant/environment";

export const getShiftActive = async () => {
    const res = await fetch(`${environment.API_URL}/shifts/active`, {
        method: "GET",
        credentials: "include",
    });

    if (res.status === 404) {
        return { success: true, data: null };
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil status shift");
    return data;
};
export const getShiftToday = async (outletId) => {
    const res = await fetch(`${environment.API_URL}/shifts/summary?outletId=${outletId}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil ringkasan shift");
    return data;
};

export const getShiftOpen = async () => {
    const res = await fetch(`${environment.API_URL}/shifts/open`, {
        method: "POST",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};
export const getShiftClose = async (id) => {
    const res = await fetch(`${environment.API_URL}/shifts/${id}/close`, {
        method: "PATCH",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
    return data;
};

export const getCashiersStatus = async (outletId) => {
    const res = await fetch(`${environment.API_URL}/shifts/cashiers?outletId=${outletId}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil status kasir");
    return data;
};

// Riwayat semua shift (untuk tabel Riwayat Shift)
export const getShifts = async (outletId) => {
    const res = await fetch(`${environment.API_URL}/shifts?outletId=${outletId}`, {
        method: "GET",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengambil riwayat shift");
    return data;
};

// Admin membuka shift untuk kasir tertentu
export const forceOpenShift = async (cashierId) => {
    const res = await fetch(`${environment.API_URL}/shifts/admin/force-open`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cashierId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal membuka shift kasir");
    return data;
};

// Admin menutup paksa shift tertentu
export const forceCloseShift = async (id) => {
    const res = await fetch(`${environment.API_URL}/shifts/${id}/admin/force-close`, {
        method: "PATCH",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menutup shift");
    return data;
};