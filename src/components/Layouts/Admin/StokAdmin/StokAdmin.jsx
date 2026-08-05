import { FiBox, FiSearch, FiAlertTriangle, FiPackage } from "react-icons/fi";

const stockData = [
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
  { nama: "Nasi Goreng", kategori: "Makanan", cabang: "Jakarta Pusat", stokTersedia: 50, minStok: 10, status: "Normal", tanggal: "09 Feb 2024" },
];

const summaryCards = [
  { label: "Total Produk", value: 7, icon: FiBox, tone: "bg-white text-slate-800 border-slate-200" },
  { label: "Stok Menipis", value: 0, icon: FiAlertTriangle, tone: "bg-white text-slate-800 border-slate-200" },
  { label: "Stok Habis", value: 0, icon: FiPackage, tone: "bg-white text-slate-800 border-slate-200" },
];

const StokAdmin = () => {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={`rounded-xl border bg-white p-3 shadow-sm ${tone}`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.92rem] font-medium text-slate-600">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                <Icon size={16} />
              </span>
            </div>
            <div className="text-[2rem] font-semibold leading-none text-slate-800">{value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[1.1rem] font-semibold text-slate-700">Daftar Stok</h3>
        </div>

        <div className="mb-4 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3">
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
            <option>Semua kategori</option>
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
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Cabang</th>
                  <th className="px-4 py-3">Stok Tersedia</th>
                  <th className="px-4 py-3">Min. Stok</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Terakhir Update</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map(({ nama, kategori, cabang, stokTersedia, minStok, status, tanggal }, index) => (
                  <tr key={`${nama}-${index}`} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-medium text-slate-700">{nama}</td>
                    <td className="px-4 py-3">{kategori}</td>
                    <td className="px-4 py-3">{cabang}</td>
                    <td className="px-4 py-3">{stokTersedia}</td>
                    <td className="px-4 py-3">{minStok}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700">
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tanggal}</td>
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

export default StokAdmin