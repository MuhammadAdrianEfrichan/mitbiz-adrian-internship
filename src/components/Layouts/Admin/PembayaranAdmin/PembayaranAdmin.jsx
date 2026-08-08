import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";

const pembayaranData = [
  {
    metode: "Tunai",
    cabang: "Cabang Jakarta Pusat, Cabang Jakarta Selatan, Cabang Tangerang",
    status: "Aktif",
  },
  {
    metode: "QRIS",
    cabang: "Cabang Jakarta Pusat, Cabang Jakarta Selatan",
    status: "Aktif",
  },
];

const PembayaranAdmin = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-5 py-4">
        <h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar metode pembayaran</h3>
      </div>

      <div className="px-5 pb-4">
        <label className="relative block">
          <span className="sr-only">Cari metode pembayaran</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari metode pembayaran..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
              <th className="px-5 py-3">Metode Pembayaran</th>
              <th className="px-5 py-3">Cabang yang Menggunakan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pembayaranData.map(({ metode, cabang, status }) => (
              <tr key={metode} className="border-t border-slate-200 text-sm text-slate-700">
                <td className="px-5 py-4">{metode}</td>
                <td className="px-5 py-4">{cabang}</td>
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
                      aria-label={`Edit ${metode}`}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                      aria-label={`Hapus ${metode}`}
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
  );
};

export default PembayaranAdmin;