import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";

const kategoriData = [
  { name: "Makanan", count: "1 produk", status: "Aktif" },
  { name: "Minuman", count: "2 produk", status: "Aktif" },
  { name: "Snack", count: "2 produk", status: "Aktif" },
  { name: "Alat Tulis", count: "2 produk", status: "Aktif" },
];

const KategoriAdmin = ({refreshKey, onEdit}) => {

  
  return (
    <div className="space-y-5">
    

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        
        <div className="px-4 pt-4">
        <div>
        <h2 className="text-md py-4 font-bold tracking-tight text-slate-800">Daftar kategori</h2>
      </div>
          <label className="relative block pb-3">
            <span className="sr-only">Cari kategori</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari kategori..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Username</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kategoriData.map(({ name, count, status }) => (
                <tr key={name} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-5 py-4">{name}</td>
                  <td className="px-5 py-4">{count}</td>
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
                        aria-label={`Edit ${name}`}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label={`Hapus ${name}`}
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
      </div>
    </div>
  );
};

export default KategoriAdmin;