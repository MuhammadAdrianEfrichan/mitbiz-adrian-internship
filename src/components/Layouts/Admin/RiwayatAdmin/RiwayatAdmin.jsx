import { FiSearch, FiEye } from "react-icons/fi";

const summaryCards = [
  { label: "Total Penjualan", value: "Rp 30.461.227", icon: "◌", tone: "bg-white text-slate-800 border-slate-200" },
  { label: "Total Transaksi", value: "390", icon: "◌", tone: "bg-white text-slate-800 border-slate-200" },
  { label: "Total Diskon", value: "Rp 831.879", icon: "◌", tone: "bg-white text-slate-800 border-slate-200" },
  { label: "Total Pajak", value: "Rp 2.769.106", icon: "◌", tone: "bg-white text-slate-800 border-slate-200" },
];

const transactionData = [
  { invoice: "INV/2026/02/00010", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Siti Rahayu", metode: "Debit Card", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00009", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "QRIS", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00008", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Tunai", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00007", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Debit Card", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00006", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "E-Wallet", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00005", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Debit Card", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00004", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Debit Card", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00003", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Debit Card", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00002", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Debit Card", total: "Rp 42.946", aksi: true },
  { invoice: "INV/2026/02/00001", tanggal: "26 Feb 2026, 19:50", cabang: "Cabang Tangerang", kasir: "Dedi Setiawan", metode: "Debit Card", total: "Rp 42.946", aksi: true },
];

const RiwayatAdmin = () => {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-4 gap-4">
        {summaryCards.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.9rem] font-medium text-slate-600">{label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                <span className="text-xs">◌</span>
              </span>
            </div>
            <div className="text-[1.8rem] font-bold leading-none text-slate-800">{value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar Transaksi</h3>
        </div>

        <div className="mb-4 grid grid-cols-[1.5fr_1fr_1fr] gap-3">
          <label className="relative block">
            <span className="sr-only">Cari produk</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Semua cabang</option>
          </select>

          <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Semua status</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">No. Invoice</th>
                  <th className="px-4 py-3">Tanggal & Waktu</th>
                  <th className="px-4 py-3">Cabang</th>
                  <th className="px-4 py-3">Kasir</th>
                  <th className="px-4 py-3">Metode Pembayaran</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((transaction, index) => (
                  <tr key={`${transaction.invoice}-${index}`} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-medium text-slate-700">{transaction.invoice}</td>
                    <td className="px-4 py-3">{transaction.tanggal}</td>
                    <td className="px-4 py-3">{transaction.cabang}</td>
                    <td className="px-4 py-3">{transaction.kasir}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {transaction.metode}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{transaction.total}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-blue-400 hover:text-blue-500"
                        aria-label={`Lihat ${transaction.invoice}`}
                      >
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RiwayatAdmin;