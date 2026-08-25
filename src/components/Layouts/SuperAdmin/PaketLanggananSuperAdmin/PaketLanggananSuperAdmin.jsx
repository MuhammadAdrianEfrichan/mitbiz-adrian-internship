import { useState } from "react";
import { FiCheck, FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

const plans = [
    {
        name: "Paket Basic",
        description: "Solusi sederhana untuk bisnis kecil yang baru memulai",
        price: "Rp 99.000",
        period: "/Bulan",
        features: ["Maks 1 Cabang", "Maks 3 Kasir", "Transaksi POS", "Laporan Penjualan"],
        businesses: "12 Bisnis",
        featured: true,
    },
    {
        name: "Paket Pro",
        description: "Untuk bisnis yang memiliki beberapa cabang dan membutuhkan laporan lebih lengkap",
        price: "Rp 1.999.000",
        period: "/Tahun",
        features: ["Maks 5 Cabang", "Maks 10 Kasir", "Laporan Lengkap", "Manajemen Stok", "Diskon & Pajak"],
        businesses: "4 Bisnis",
    },
];

const customers = [
    { business: "Cafe Kita", owner: "Rina", plan: "Pro", expired: "12 Aug" },
];

const branches = [
    { business: "Cafe Kita", used: 3, total: 5, remaining: 2, plan: "Pro" },
];

const TabButton = ({ active, children, onClick }) => (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`rounded-md px-3 py-1.5 text-sm font-medium ${active ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}`}>
        {children}
    </button>
);

const FilterField = ({ placeholder, options }) => options ? (
    <select className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" defaultValue=""><option value="">{placeholder}</option></select>
) : (
    <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400"><FiSearch size={16} /><input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" placeholder={placeholder} /></label>
);

const PlanCard = ({ plan }) => (
    <article className={`w-full max-w-75 rounded-2xl border bg-[#f8fafc] p-4 shadow-sm ${plan.featured ? "border-2 border-[#1c86ef]" : "border-slate-200"}`}>
        <div className="flex items-start justify-between gap-3"><h2 className="text-base font-semibold text-slate-800">{plan.name}</h2><span className="rounded-md bg-[#1c86ef] px-2 py-1 text-xs font-medium text-white">Aktif</span></div>
        <p className="mt-2 min-h-10 text-xs leading-4 text-slate-500">{plan.description}</p>
        <p className="mt-5 text-xl font-semibold text-[#1c86ef]">{plan.price}</p><p className="text-xs text-slate-400">{plan.period}</p>
        <p className="mt-5 text-xs text-slate-600">Fitur:</p>
        <ul className="mt-1 space-y-1 text-xs text-slate-600">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-1.5"><FiCheck className="text-[#1c86ef]" size={14} />{feature}</li>)}</ul>
        <p className="mt-4 text-xs text-slate-500">Digunakan oleh:</p><span className="mt-1 inline-block rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">{plan.businesses}</span>
        <div className="mt-4 flex items-center gap-2 border-t border-slate-300 pt-3"><button type="button" className="flex h-8 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-100"><FiEdit2 size={15} />Edit</button><button type="button" aria-label={`Hapus ${plan.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-red-500 hover:bg-red-50"><FiTrash2 size={15} /></button></div>
    </article>
);

const StatusBadge = () => <span className="rounded-md bg-[#1c86ef] px-2 py-1 text-xs font-medium text-white">Aktif</span>;
const ViewButton = ({ label }) => <button type="button" aria-label={`Lihat ${label}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"><FiEye size={16} /></button>;

const SubscribersTable = () => (
    <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="grid gap-2 md:grid-cols-[1.5fr_1fr_1fr]"><FilterField placeholder="Cari bisnis..." /><FilterField placeholder="Semua Cabang" options /><FilterField placeholder="Aktif" options /></div><div className="mt-3 overflow-x-auto"><table className="w-full min-w-175 table-fixed text-left text-sm text-slate-600"><thead className="bg-slate-100 text-slate-700"><tr><th className="w-[20%] px-3 py-2 font-medium">Bisnis</th><th className="w-[20%] px-3 py-2 font-medium">Owner</th><th className="w-[20%] px-3 py-2 font-medium">Paket</th><th className="w-[20%] px-3 py-2 font-medium">Status</th><th className="w-[15%] px-3 py-2 font-medium">Expired</th><th className="w-[5%] px-3 py-2 font-medium">Aksi</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.business} className="border-b border-slate-100 last:border-0"><td className="px-3 py-3">{customer.business}</td><td className="px-3 py-3">{customer.owner}</td><td className="px-3 py-3">{customer.plan}</td><td className="px-3 py-3"><StatusBadge /></td><td className="px-3 py-3">{customer.expired}</td><td className="px-3 py-3"><ViewButton label={customer.business} /></td></tr>)}</tbody></table></div></section>
);

const BranchPlans = () => (
    <section className="mt-4"><div className="grid gap-2 md:grid-cols-[1.5fr_1fr]"><FilterField placeholder="Cari Bisnis..." /><FilterField placeholder="Filter Paket" options /></div><div className="mt-4"><article className="w-full max-w-75 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-base font-semibold text-slate-800">{branches[0].business}</h2><span className="rounded-md bg-[#1c86ef] px-2 py-1 text-xs font-medium text-white">{branches[0].plan}</span></div><div className="mt-5 space-y-2 text-sm text-slate-500"><p className="flex justify-between">Cabang Digunakan <span><b className="text-[#1c86ef]">{branches[0].used}</b> / {branches[0].total} Cabang</span></p><p className="flex justify-between">Sisa Cabang <b className="text-slate-700">{branches[0].remaining}</b></p></div><button type="button" className="mt-5 h-9 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-100">Lihat Detail</button></article></div></section>
);

const PaketLanggananSuperAdmin = () => {
    const [activeTab, setActiveTab] = useState("plans");
    return <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8"><header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-800">Manajemen Langganan - Semua Cabang</h1><p className="mt-1 text-sm text-slate-500">Kelola paket langganan untuk semua cabang</p></div><button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]"><FiPlus size={17} />Tambah Paket</button></header><div className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1" role="tablist" aria-label="Jenis data langganan"><TabButton active={activeTab === "plans"} onClick={() => setActiveTab("plans")}>Paket Langganan</TabButton><TabButton active={activeTab === "customers"} onClick={() => setActiveTab("customers")}>Pelanggan Aktif</TabButton><TabButton active={activeTab === "branches"} onClick={() => setActiveTab("branches")}>Per Cabang</TabButton></div>{activeTab === "plans" && <><div className="mt-4 grid max-w-190 gap-2 md:grid-cols-[1.5fr_1fr_0.7fr_0.6fr]"><FilterField placeholder="Cari paket..." /><FilterField placeholder="Semua Durasi" options /><FilterField placeholder="Semua" options /><span /></div><section className="mt-4 flex flex-wrap gap-4">{plans.map((plan) => <PlanCard key={plan.name} plan={plan} />)}</section></>}{activeTab === "customers" && <SubscribersTable />}{activeTab === "branches" && <BranchPlans />}</main>;
};

export default PaketLanggananSuperAdmin;
