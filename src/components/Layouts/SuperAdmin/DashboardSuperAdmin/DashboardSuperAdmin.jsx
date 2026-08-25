import { useEffect, useState } from "react";
import { FiChevronDown, FiSearch, FiHome } from "react-icons/fi";
import PenjualanPerCabangAdmin from "../../../fragments/Admin/PenjualanPerCabangAdmin";
import PenjualanPerPembayaran from "../../../fragments/Admin/PenjualanPerPembayaran";
import ProdukTerLaris from "../../../fragments/Admin/ProdukTerLaris";
import SummaryCard from "../../../fragments/Admin/SummaryCard";
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin";
import { getDasboard } from "../../../../services/dasboard.service";

const staticSummary = {
    totalPenjualan: 24439540,
    totalTransaksi: 333,
    cabangAktif: 3,
    cabangTotal: 3,
    kasirAktif: 4,
    kasirTotal: 4,
    produkAktif: 8,
    produkTotal: 8,
};

const staticTrend = [
    { date: "2026-02-01", amount: 2800000 },
    { date: "2026-02-02", amount: 1600000 },
    { date: "2026-02-03", amount: 4200000 },
    { date: "2026-02-04", amount: 2200000 },
    { date: "2026-02-05", amount: 3100000 },
    { date: "2026-02-06", amount: 6200000 },
    { date: "2026-02-07", amount: 3500000 },
];

const staticBranches = [
    { name: "Jakarta Pusat", sales: 4800000 },
    { name: "Jakarta Selatan", sales: 3900000 },
    { name: "Tangerang", sales: 5200000 },
    { name: "Padang", sales: 4700000 },
];

const staticPaymentMethods = [
    { name: "Tunai", value: 8200000 },
    { name: "QRIS", value: 6900000 },
    { name: "Transfer", value: 5400000 },
    { name: "Kartu", value: 3939540 },
];

const staticProducts = [
    { name: "Nasi Goreng", quantitySold: 128, totalAmount: 5556845 },
    { name: "Mie Goreng", quantitySold: 112, totalAmount: 5225757 },
    { name: "Coklat Batang", quantitySold: 96, totalAmount: 3748582 },
    { name: "Keripik Kentang", quantitySold: 88, totalAmount: 2346725 },
    { name: "Buku Tulis", quantitySold: 74, totalAmount: 1902717 },
];

const staticBranchStatus = [
    { name: "Cabang Jakarta Pusat", transactions: 110 },
    { name: "Cabang Jakarta Selatan", transactions: 124 },
    { name: "Cabang Tangerang", transactions: 122 },
];

const BranchStatus = () => (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-[1.05rem] font-semibold text-slate-700">Status Cabang</h3>
        <div className="space-y-3">
            {staticBranchStatus.map((branch) => (
                <div key={branch.name} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                        <FiHome size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">{branch.name}</p>
                        <p className="text-[11px] text-slate-400">{branch.transactions} transaksi</p>
                    </div>
                    <span className="rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white">Aktif</span>
                </div>
            ))}
        </div>
    </section>
);

const DashboardSuperAdmin = () => {
    const [dashboard, setDashboard] = useState({
        summary: staticSummary,
        trend: staticTrend,
        perOutlet: staticBranches,
        perPayment: staticPaymentMethods,
        topProducts: staticProducts,
    });

    useEffect(() => {
        let active = true;

        const fetchDashboard = async () => {
            try {
                const response = await getDasboard();
                const data = response?.data?.data ?? response?.data ?? {};
                if (!active) return;

                setDashboard((current) => ({
                    summary: data.summary ?? current.summary,
                    trend: data.trend?.length ? data.trend : current.trend,
                    perOutlet: data.perOutlet?.length ? data.perOutlet : current.perOutlet,
                    perPayment: data.perPayment?.length ? data.perPayment : current.perPayment,
                    topProducts: data.topProducts?.length ? data.topProducts : current.topProducts,
                }));
            } catch {
                // Static dashboard data keeps the layout useful until the API is available.
            }
        };

        fetchDashboard();
        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-sm">
                    <FiSearch size={16} />
                    <input
                        type="search"
                        placeholder="Cari informasi bisnis..."
                        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
                    />
                </label>
                <button type="button" className="flex w-44 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                    Bisnis Cafe Kita
                    <FiChevronDown size={15} />
                </button>
            </div>
            <SummaryCard summary={dashboard.summary} />
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
                <TrenDataAdmin data={dashboard.trend} />
                <PenjualanPerCabangAdmin data={dashboard.perOutlet} />
            </section>
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
                <ProdukTerLaris products={dashboard.topProducts} />
                <BranchStatus />
            </section>
        </div>
    );
};

export default DashboardSuperAdmin