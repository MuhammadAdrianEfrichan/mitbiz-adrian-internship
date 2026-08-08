import { FiEdit2, FiPackage, FiSearch, FiTrash2 } from "react-icons/fi";

const products = [
  { sku: "FD-002", nama: "Mie Goreng", kategori: "Makanan", harga: "Rp 25.000", diskon: "10%", status: "Aktif" },
  { sku: "DR-001", nama: "Es Teh Manis", kategori: "Minuman", harga: "Rp 5.000", diskon: "-", status: "Aktif" },
  { sku: "DR-002", nama: "Es Jeruk", kategori: "Minuman", harga: "Rp 7.000", diskon: "-", status: "Aktif" },
  { sku: "SN-001", nama: "Keripik Kentang", kategori: "Snack", harga: "Rp 10.000", diskon: "-", status: "Aktif" },
];

const ProdukAdmin = () => {
  return (
    <div className="space-y-6">

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Total Produk</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FiPackage size={16} />
            </span>
          </div>
          <div className="text-[2.2rem] font-bold leading-none text-slate-800">5</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Produk Aktif</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FiPackage size={16} />
            </span>
          </div>
          <div className="text-[2.2rem] font-bold leading-none text-slate-800">5</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4">
          <h3 className="text-[1.08rem] font-semibold text-slate-700">Daftar Produk</h3>
        </div>

        <div className="flex items-center gap-3 px-5 pb-4">
          <label className="relative block w-full">
            <span className="sr-only">Cari produk</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari kasir berdasarkan nama atau username..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <select
            className="min-w-[180px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Semua kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Nama Produk</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Harga</th>
                <th className="px-5 py-3">Diskon</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(({ sku, nama, kategori, harga, diskon, status }) => (
                <tr key={sku} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-5 py-4">{sku}</td>
                  <td className="px-5 py-4">{nama}</td>
                  <td className="px-5 py-4">{kategori}</td>
                  <td className="px-5 py-4">
                    <div>
                      {diskon !== "-" && (
                        <p className="text-xs text-slate-400 line-through">Rp 25.000</p>
                      )}
                      <p className="font-medium text-slate-700">{harga}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {diskon === "-" ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <span className="inline-flex rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                        {diskon}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        aria-label={`Edit ${nama}`}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label={`Hapus ${nama}`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProdukAdmin;