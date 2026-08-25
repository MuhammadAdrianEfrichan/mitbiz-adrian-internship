import { useState } from "react";
import {
    FiEdit2,
    FiEye,
    FiPlus,
    FiSearch,
    FiTrash2,
} from "react-icons/fi";

const users = [
    { name: "Administrator", username: "admin", role: "Admin", branch: "Cabang Jakarta Pusat" },
    { name: "Andi Wijaya", username: "admin2", role: "Admin", branch: "Cabang Jakarta Selatan" },
    { name: "Budi Santoso", username: "kasir1", role: "Kasir", branch: "Cabang Jakarta Pusat" },
    { name: "Jacob Jones", username: "Owner1", role: "Owner", branch: "Cabang Jakarta Pusat" },
];

const customers = [
    { name: "Rudi Hartono", contact: "rudi.hartono@email.com", branch: "Cabang Jakarta Pusat", plan: "1 Paket" },
    { name: "Rudi Hartono", contact: "rudi.hartono@email.com", branch: "Cabang Jakarta Pusat", plan: "1 Paket" },
];

const SummaryCard = ({ label, value, detail }) => (
    <article className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm">
        <div className="flex items-start justify-between">
            <h2 className="text-base font-medium text-slate-700">{label}</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400">◎</span>
        </div>
        <p className="mt-4 text-2xl font-semibold text-slate-800">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{detail}</p>
    </article>
);

const StatusBadge = () => (
    <span className="rounded-md bg-[#1c86ef] px-2 py-1 text-sm font-medium text-white">Aktif</span>
);

const ActionButtons = ({ customer = false, label }) => (
    <div className="flex items-center justify-center gap-2">
        <button type="button" aria-label={`${customer ? "Lihat" : "Edit"} ${label}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
            {customer ? <FiEye size={16} /> : <FiEdit2 size={16} />}
        </button>
        {!customer && (
            <button type="button" aria-label={`Hapus ${label}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-red-500 hover:bg-red-50">
                <FiTrash2 size={16} />
            </button>
        )}
    </div>
);

const ManajementUserSuperAdmin = () => {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manajemen User</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola admin dan kasir di semua cabang</p>
                </div>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]">
                    <FiPlus size={17} />
                    Tambah User
                </button>
            </header>

            <div className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1" role="tablist" aria-label="Jenis data user">
                <button type="button" role="tab" aria-selected={activeTab === "users"} onClick={() => setActiveTab("users")} className={`rounded-md px-3 py-1.5 text-sm font-medium ${activeTab === "users" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}`}>
                    Ringkasan
                </button>
                <button type="button" role="tab" aria-selected={activeTab === "customers"} onClick={() => setActiveTab("customers")} className={`rounded-md px-3 py-1.5 text-sm font-medium ${activeTab === "customers" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}`}>
                    Daftar Pelanggan
                </button>
            </div>

            {activeTab === "users" ? (
                <>
                    <section className="mt-4 grid gap-4 md:grid-cols-3" aria-label="Ringkasan user">
                        <SummaryCard label="Total Admin" value="3" detail="Aktif di semua cabang" />
                        <SummaryCard label="Total Kasir" value="4" detail="Aktif di semua cabang" />
                        <SummaryCard label="Total User" value="7" detail="Dari semua role" />
                    </section>
                    <UserTable />
                </>
            ) : <CustomerTable />}
        </main>
    );
};

const UserTable = () => (
    <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <FilterBar firstPlaceholder="Cari nama atau username..." secondLabel="Semua role" thirdLabel="Semua cabang" />
        <div className="overflow-x-auto">
            <table className="w-full min-w-175 table-fixed text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-700"><tr><th className="w-[18%] px-3 py-2 font-medium">Nama</th><th className="w-[17%] px-3 py-2 font-medium">Username</th><th className="w-[17%] px-3 py-2 font-medium">Role</th><th className="w-[20%] px-3 py-2 font-medium">Cabang</th><th className="w-[15%] px-3 py-2 font-medium">Status</th><th className="w-[13%] px-3 py-2 text-center font-medium">Aksi</th></tr></thead>
                <tbody>{users.map((user) => <tr key={`${user.username}-${user.branch}`} className="border-b border-slate-100 last:border-0"><td className="px-3 py-3">{user.name}</td><td className="px-3 py-3">{user.username}</td><td className="px-3 py-3"><span className={user.role === "Admin" ? "rounded bg-blue-600 px-2 py-1 text-white" : "rounded border border-slate-300 px-2 py-1"}>{user.role.toLowerCase()}</span></td><td className="px-3 py-3">{user.branch}</td><td className="px-3 py-3"><StatusBadge /></td><td className="px-3 py-3"><ActionButtons label={user.name} /></td></tr>)}</tbody>
            </table>
        </div>
    </section>
);

const CustomerTable = () => (
    <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <FilterBar firstPlaceholder="Cari nama, email atau telepon..." secondLabel="Semua Cabang" thirdLabel="Aktif" />
        <div className="overflow-x-auto"><table className="w-full min-w-175 table-fixed text-left text-sm text-slate-600"><thead className="bg-slate-100 text-slate-700"><tr><th className="w-[16%] px-3 py-2 font-medium">Nama</th><th className="w-[27%] px-3 py-2 font-medium">Kontak</th><th className="w-[24%] px-3 py-2 font-medium">Cabang</th><th className="w-[16%] px-3 py-2 font-medium">Langganan</th><th className="w-[11%] px-3 py-2 font-medium">Status</th><th className="w-[6%] px-3 py-2 text-center font-medium">Aksi</th></tr></thead><tbody>{customers.map((customer, index) => <tr key={`${customer.contact}-${index}`} className="border-b border-slate-100 last:border-0"><td className="px-3 py-3">{customer.name}</td><td className="px-3 py-3">{customer.contact}</td><td className="px-3 py-3">{customer.branch}</td><td className="px-3 py-3">{customer.plan}</td><td className="px-3 py-3"><StatusBadge /></td><td className="px-3 py-3"><ActionButtons customer label={customer.name} /></td></tr>)}</tbody></table></div>
    </section>
);

const FilterBar = ({ firstPlaceholder, secondLabel, thirdLabel }) => (
    <div className="mb-3 grid gap-2 md:grid-cols-[1.5fr_1fr_1fr]">
        <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400"><FiSearch size={16} /><input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" placeholder={firstPlaceholder} /></label>
        <select className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" defaultValue=""><option value="">{secondLabel}</option></select>
        <select className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" defaultValue=""><option value="">{thirdLabel}</option></select>
    </div>
);

export default ManajementUserSuperAdmin;
