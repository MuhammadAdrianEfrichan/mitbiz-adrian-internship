import { useEffect, useState } from "react";
import { FiBriefcase, FiDollarSign, FiUsers } from "react-icons/fi";
import PenjualanPerPembayaran from "../../../fragments/Admin/PenjualanPerPembayaran";
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin";
import { getDasboard } from "../../../../services/Admin/dasboard.service";

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

const SummaryCard = ({ label, value, detail, icon: Icon, featured = false }) => (
    <article className={`rounded-xl border p-4 shadow-sm ${featured ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-800"}`}>
        <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className={`text-sm font-medium ${featured ? "text-blue-100" : "text-slate-600"}`}>{label}</h2>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${featured ? "bg-blue-500 text-white" : "border border-slate-200 bg-slate-50 text-slate-500"}`}><Icon size={15} /></span>
        </div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className={`mt-2 text-xs ${featured ? "text-blue-100" : "text-slate-400"}`}>{detail}</p>
    </article>
);

const TopTenants = ({ tenants }) => (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-700">Tenant Teratas</h2>
            <span className="text-xs text-slate-400">Berdasarkan pendapatan</span>
        </div>
        {tenants.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">Belum ada data tenant.</p> : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-sm text-slate-600">
                    <thead className="border-b border-slate-100 text-xs uppercase text-slate-400"><tr><th className="px-3 py-2 font-medium">Tenant</th><th className="px-3 py-2 font-medium">Transaksi</th><th className="px-3 py-2 text-right font-medium">Pendapatan</th></tr></thead>
                    <tbody>{tenants.map((tenant, index) => <tr key={tenant.tenantId ?? tenant.tenantName ?? index} className="border-b border-slate-100 last:border-0"><td className="max-w-[15rem] truncate px-3 py-3 font-medium text-slate-700">{tenant.tenantName ?? "-"}</td><td className="px-3 py-3">{tenant.transactionCount ?? 0}</td><td className="px-3 py-3 text-right font-medium text-slate-700">{formatRupiah(tenant.totalAmount)}</td></tr>)}</tbody>
                </table>
            </div>
        )}
    </section>
);

const DashboardSuperAdmin = () => {
    const [dashboard, setDashboard] = useState({ summary: {}, trend: [], topTenants: [], perPayment: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchDashboard = async () => {
            try {
                const response = await getDasboard();
                const data = response?.data?.data ?? response?.data ?? {};
                if (!active) return;

                setDashboard({ summary: data.summary ?? {}, trend: data.trend ?? [], topTenants: data.topTenants ?? [], perPayment: data.perPayment ?? [] });
            } catch (requestError) {
                if (active) setError(requestError.message || "Gagal mengambil data dashboard.");
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchDashboard();
        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="space-y-5">
            {loading && <p className="text-sm text-slate-500">Memuat dashboard...</p>}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard featured label="Total Pendapatan" value={formatRupiah(dashboard.summary.totalPendapatan)} detail={`${dashboard.summary.totalTransaksi ?? 0} total transaksi`} icon={FiDollarSign} />
                <SummaryCard label="Total Transaksi" value={dashboard.summary.totalTransaksi ?? 0} detail="Seluruh tenant" icon={FiBriefcase} />
                <SummaryCard label="Tenant Aktif" value={dashboard.summary.tenantAktif ?? 0} detail={`dari ${dashboard.summary.tenantTotal ?? 0} tenant`} icon={FiBriefcase} />
                <SummaryCard label="User Aktif" value={dashboard.summary.userAktif ?? 0} detail="Pengguna terdaftar aktif" icon={FiUsers} />
            </section>
            <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
                <TrenDataAdmin data={dashboard.trend} />
                <PenjualanPerPembayaran data={dashboard.perPayment} />
            </section>
            <TopTenants tenants={dashboard.topTenants} />
        </div>
    );
};

export default DashboardSuperAdmin