import { FiEdit2, FiEye, FiTrash2, FiBriefcase, FiCheckCircle, FiXCircle } from "react-icons/fi";

const cabangData = [
  {
    name: "Cabang Jakarta Pusat",
    alamat: "Jl. Sudirman No. 123, Jakarta Pusat",
    telepon: "021-12345678",
    status: "Aktif",
  },
  {
    name: "Cabang Jakarta Selatan",
    alamat: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
    telepon: "021-87654321",
    status: "Aktif",
  },
  {
    name: "Cabang Tangerang",
    alamat: "Jl. BSD Raya No. 789, Tangerang",
    telepon: "021-99887766",
    status: "Aktif",
  },
  {
    name: "Cabang Padang",
    alamat: "Jl. Dr Sutomo No. 123, Padang Barat",
    telepon: "021-22564786",
    status: "Aktif",
  },
];

const summaryCards = [
  { label: "Total Cabang", value: 4, icon: FiBriefcase, accent: "border-blue-300 bg-white text-slate-800" },
  { label: "Cabang Aktif", value: 4, icon: FiCheckCircle, accent: "border-green-300 bg-white text-slate-800" },
  { label: "Cabang Nonaktif", value: 0, icon: FiXCircle, accent: "border-red-300 bg-white text-slate-800" },
];

const CabangAdmin = () => {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {summaryCards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-xl border ${accent} px-4 py-4`}
          >
            <div className="text-left">
              <p className="text-[0.9rem] font-medium text-slate-600">{label}</p>
              <p className="mt-3 text-[2.2rem] font-bold leading-none text-slate-800">{value}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon size={18} />
            </span>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4">
          <h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar Cabang</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-5 py-3">Nama Cabang</th>
                <th className="px-5 py-3">Alamat</th>
                <th className="px-5 py-3">Telepon</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cabangData.map(({ name, alamat, telepon, status }) => (
                <tr key={name} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-5 py-4">{name}</td>
                  <td className="px-5 py-4">{alamat}</td>
                  <td className="px-5 py-4">{telepon}</td>
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
      </section>
    </div>
  );
};

export default CabangAdmin;