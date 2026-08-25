import { FiDollarSign, FiBriefcase, FiUsers, FiBox } from "react-icons/fi"

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`

const SummaryCard = ({ summary }) => {
    const cards = [
    {
        label: `Total Penjualan (30 Hari)`,
        value: formatRupiah(summary?.totalPenjualan ?? summary?.totalSales ?? 0),
        sub: `${summary?.totalTransaksi ?? summary?.totalTransactions ?? 0} transaksi`,
        icon: FiDollarSign,
    },
    {
        label: "Cabang Aktif",
        value: summary?.cabangAktif ?? 0,
        sub: `dari ${summary?.cabangTotal ?? 0} total`,
        icon: FiBriefcase,
    },
    {
        label: "Kasir Aktif",
        value: summary?.kasirAktif ?? 0,
        sub: `dari ${summary?.kasirTotal ?? 0} total`,
        icon: FiUsers,
    },
    {
        label: "Produk Aktif",
        value: summary?.produkAktif ?? 0,
        sub: `dari ${summary?.produkTotal ?? 0} total`,
        icon: FiBox,
    },
]
    return (
        <section className="grid grid-cols-4 gap-4 mb-6">
            {cards.map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[0.9rem] font-medium text-slate-600">{label}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                            <Icon size={15} />
                        </span>
                    </div>
                    <div className="text-[1.8rem] font-bold leading-none text-slate-800">{value}</div>
                    <div className="mt-1 text-xs text-slate-400">{sub}</div>
                </div>
            ))}
        </section>
    )
}

export default SummaryCard