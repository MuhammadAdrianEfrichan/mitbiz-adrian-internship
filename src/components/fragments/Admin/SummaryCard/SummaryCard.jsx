import {
  FiBox,
  FiBriefcase,
  FiCreditCard,
  FiDollarSign,
  FiPackage,
  FiUsers,
} from "react-icons/fi";

const summaryCards = [
  {
    label: "Total Penjualan (30 Hari)",
    value: "Rp 26.677.001",
    subtext: "337 transaksi",
    icon: FiDollarSign,
    accent: "bg-[#eaf2ff] text-[#0a5cb3]",
  },
  {
    label: "Cabang Aktif",
    value: "3",
    subtext: "dari 10 total",
    icon: FiBriefcase,
    accent: "bg-[#eefaf3] text-[#1ea16c]",
  },
  {
    label: "Kasir Aktif",
    value: "4",
    subtext: "Kasir terdaftar",
    icon: FiUsers,
    accent: "bg-[#fff3e8] text-[#f29b29]",
  },
  {
    label: "Produk Aktif",
    value: "8",
    subtext: "dari 8 total",
    icon: FiPackage,
    accent: "bg-[#f3ecff] text-[#7b5ce9]",
  },
];

const SummaryCard = ()=>{
    return(
        <section className="grid grid-cols-4 gap-4">
          {summaryCards.map(({ label, value, subtext, icon: Icon, accent }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
                  <Icon size={16} />
                </span>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[2rem] font-bold leading-none text-slate-800">{value}</p>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-500">{subtext}</p>
            </div>
          ))}
        </section>
    )
}

export default SummaryCard