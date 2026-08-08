import { FiArrowDown, FiArrowUp, FiSearch } from "react-icons/fi";

const adjustmentData = [
  {
    tanggal: "20 Feb 2026, 15:01",
    produk: "Nasi Goreng",
    cabang: "Cabang Jakarta Pusat",
    tipe: "Tambah",
    jumlah: 50,
    alasan: "Restok dari supplier",
    tipeColor: "bg-emerald-500",
  },
  {
    tanggal: "20 Feb 2026, 15:01",
    produk: "Es Teh Manis",
    cabang: "Cabang Jakarta Pusat",
    tipe: "Kurangi",
    jumlah: 10,
    alasan: "Produk rusak/expired",
    tipeColor: "bg-red-500",
  },
  {
    tanggal: "20 Feb 2026, 15:01",
    produk: "Keripik Kentang",
    cabang: "Cabang Jakarta Selatan",
    tipe: "Tambah",
    jumlah: 30,
    alasan: "Transfer dari cabang lain",
    tipeColor: "bg-emerald-500",
  },
  {
    tanggal: "20 Feb 2026, 15:01",
    produk: "Pulpen Biru",
    cabang: "Cabang Jakarta Pusat",
    tipe: "Kurangi",
    jumlah: 5,
    alasan: "Stok opname – selisih",
    tipeColor: "bg-red-500",
  },
];

const PenyesuaianStokAdmin = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar Produk</h3>
      </div>

      <div className="mb-4 grid grid-cols-[1.5fr_1fr] gap-3">
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
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-slate-700">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Alasan</th>
              </tr>
            </thead>

            <tbody>
              {adjustmentData.map((item, index) => (
                <tr key={`${item.produk}-${index}`} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-3 text-slate-700">{item.tanggal}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{item.produk}</td>
                  <td className="px-4 py-3">{item.cabang}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm ${item.tipeColor}`}
                    >
                      {item.tipe === "Tambah" ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                      {item.tipe}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.jumlah}</td>
                  <td className="px-4 py-3 text-slate-600">{item.alasan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PenyesuaianStokAdmin;