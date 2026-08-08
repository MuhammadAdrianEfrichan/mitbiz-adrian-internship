import { FiBriefcase, FiEye, FiClock, FiCheckCircle, FiDollarSign } from "react-icons/fi";

const summaryCards = [
  { label: "Shift Aktif", value: 4, icon: FiBriefcase },
  { label: "Shift Hari Ini", value: 4, icon: FiClock },
  { label: "Penjualan Hari Ini", value: 0, icon: FiDollarSign },
];

const cashierData = [
  { nama: "Budi Santoso", status: "Tersedia", role: "kasir 1", button: "Buka Shift" },
  { nama: "Rina Marlina", status: "Tersedia", role: "kasir 4", button: "Buka Shift" },
  { nama: "Rina Marlina", status: "Tersedia", role: "kasir 4", button: "Buka Shift" },
];

const historyData = [
  { kasir: "Budi Santoso", dibuka: "-", ditutup: "-", penjualan: "Rp 0", transaksi: 0, status: "Ditutup" },
  { kasir: "Budi Santoso", dibuka: "-", ditutup: "-", penjualan: "Rp 0", transaksi: 0, status: "Ditutup" },
  { kasir: "Budi Santoso", dibuka: "-", ditutup: "-", penjualan: "Rp 0", transaksi: 0, status: "Ditutup" },
  { kasir: "Budi Santoso", dibuka: "-", ditutup: "-", penjualan: "Rp 0", transaksi: 0, status: "Ditutup" },
];

const ShiftKasirAdmin = () => {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.92rem] font-medium text-slate-600">{label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                <Icon size={15} />
              </span>
            </div>
            <div className="text-[2rem] font-semibold leading-none text-slate-800">{value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h3 className="text-[1.08rem] font-semibold text-slate-700">Kasir Tersedia</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {cashierData.map(({ nama, status, role, button }) => (
            <div key={`${nama}-${role}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                    <FiBriefcase size={15} />
                  </div>
                  <div>
                    <div className="text-[1rem] font-semibold text-slate-700">{nama}</div>
                    <div className="text-xs text-slate-500">{role}</div>
                  </div>
                </div>
                <span className="rounded-md bg-slate-200 px-2 py-1 text-[0.72rem] font-medium text-slate-600">
                  {status}
                </span>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d7ef2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#176ed8]"
              >
                <FiClock size={15} />
                {button}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h3 className="text-[1.08rem] font-semibold text-slate-700">Riwayat Shift</h3>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">Kasir</th>
                  <th className="px-4 py-3">Dibuka</th>
                  <th className="px-4 py-3">Ditutup</th>
                  <th className="px-4 py-3">Penjualan</th>
                  <th className="px-4 py-3">Transaksi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, index) => (
                  <tr key={`${item.kasir}-${index}`} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-medium text-slate-700">{item.kasir}</td>
                    <td className="px-4 py-3">{item.dibuka}</td>
                    <td className="px-4 py-3">{item.ditutup}</td>
                    <td className="px-4 py-3">{item.penjualan}</td>
                    <td className="px-4 py-3">{item.transaksi}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-blue-400 hover:text-blue-500"
                        aria-label="Lihat detail"
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

export default ShiftKasirAdmin;