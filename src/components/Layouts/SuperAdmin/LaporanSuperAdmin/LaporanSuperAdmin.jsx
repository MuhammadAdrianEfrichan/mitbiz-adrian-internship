import { FiChevronDown, FiDownload, FiFileText } from "react-icons/fi";

const summary = [
    { label: "Total Pendapatan", value: "Rp 86.613.715", detail: "Pendapatan kotor", icon: FiFileText },
    { label: "Total Transaksi", value: "1138", detail: "Jumlah transaksi", icon: FiFileText },
    { label: "Rata-rata Transaksi", value: "Rp 76.110", detail: "Per transaksi", icon: FiFileText },
    { label: "Total Diskon", value: "Rp 2.727.969", detail: "Diskon diberikan", icon: FiFileText },
];

const products = [
    ["Nasi Goreng", "288", "Rp 7.098.471"],
    ["Mie Goreng", "274", "Rp 5.395.052"],
    ["Coklat Batang", "288", "Rp 7.098.471"],
    ["Keripik Kentang", "288", "Rp 7.098.471"],
    ["Buku Tulis", "288", "Rp 7.098.471"],
    ["Es Jeruk", "288", "Rp 7.098.471"],
    ["Es Teh Manis", "288", "Rp 7.098.471"],
    ["Pulpen Biru", "288", "Rp 7.098.471"],
    ["Nasi Goreng", "288", "Rp 7.098.471"],
    ["Nasi Goreng", "288", "Rp 7.098.471"],
];

const SelectField = ({ label, value }) => (
    <label className="block min-w-0 flex-1">
        <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
        <span className="relative block">
            <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500" defaultValue="">
                <option value="">{value}</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-3.5 text-slate-400" size={16} />
        </span>
    </label>
);

const DateField = ({ label }) => (
    <label className="block min-w-0 flex-1">
        <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
        <input type="text" placeholder="dd/mm/yyyy" className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 outline-none placeholder:text-slate-400" />
    </label>
);

const SummaryCard = ({ label, value, detail, icon: Icon }) => (
    <article className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2"><h2 className="text-sm font-medium text-slate-700">{label}</h2><span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400"><Icon size={14} /></span></div>
        <p className="mt-5 text-2xl font-semibold text-slate-800">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </article>
);

const LaporanSuperAdmin = () => (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-800">Laporan Komprehensif</h1><p className="mt-1 text-base text-slate-500">Generate dan analisis laporan bisnis</p></div><button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]"><FiDownload size={17} />Export Laporan</button></header>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-base font-semibold text-slate-700">Filter Laporan</h2><div className="mt-3 flex flex-wrap gap-3"><SelectField label="Jenis Laporan" value="Laporan Penjualan" /><SelectField label="Cabang" value="Semua Cabang" /><DateField label="Tanggal Mulai" /><DateField label="Tanggal Akhir" /></div></section>
        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan laporan">{summary.map((item) => <SummaryCard key={item.label} {...item} />)}</section>
        <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-base font-semibold text-slate-700">10 Produk Terlaris</h2><div className="mt-3 overflow-x-auto"><table className="w-full min-w-175 table-fixed text-left text-sm text-slate-600"><thead className="bg-slate-100 text-slate-700"><tr><th className="w-[20%] rounded-l-lg px-3 py-2 font-medium">Peringkat</th><th className="w-[25%] px-3 py-2 font-medium">Produk</th><th className="w-[25%] px-3 py-2 font-medium">Jumlah Produk</th><th className="w-[30%] rounded-r-lg px-3 py-2 font-medium">Total Pendapatan</th></tr></thead><tbody>{products.map(([name, quantity, revenue], index) => <tr key={`${name}-${index}`} className="border-b border-slate-100 last:border-0"><td className="px-3 py-2.5">{index + 1}</td><td className="px-3 py-2.5">{name}</td><td className="px-3 py-2.5">{quantity}</td><td className="px-3 py-2.5">{revenue}</td></tr>)}</tbody></table></div></section>
    </main>
);

export default LaporanSuperAdmin;
