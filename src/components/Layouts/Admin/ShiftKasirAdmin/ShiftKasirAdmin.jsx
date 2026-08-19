import { useEffect, useState, useMemo } from "react";
import { FiBriefcase, FiEye, FiClock, FiDollarSign } from "react-icons/fi";
import {
  getCashiersStatus,
  getShifts,
  getShiftToday,
  forceOpenShift,
  forceCloseShift,
} from "../../../../services/shift..service"; 
import { getBranches } from "../../../../services/branch.service"; // sesuaikan path & nama fungsi
import { useNotification } from "../../../ui/NotificationCenter";

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

const formatJam = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const ShiftKasirAdmin = () => {
  const notification = useNotification();
  const [outlets, setOutlets] = useState([]);
  const [outletId, setOutletId] = useState("");
  const [cashiers, setCashiers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Ambil daftar outlet sekali di awal, untuk isi dropdown
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await getBranches();
        const list = unwrapList(res);
        setOutlets(list);
        if (list.length > 0) setOutletId(list[0].id)
      } catch (err) {
        console.error("Gagal mengambil daftar outlet:", err);
        setError(err.message);
      }
    };
    fetchOutlets();
  }, []);

  const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

const fetchAll = async (id) => {
  if (!id) return;
  setLoading(true);
  try {
    const [cashiersRes, shiftsRes, summaryRes] = await Promise.all([
      getCashiersStatus(id),
      getShifts(id),
      getShiftToday(id),
    ]);

    setCashiers(unwrapList(cashiersRes));
    setShifts(unwrapList(shiftsRes));
    setSummary(summaryRes?.data?.data ?? summaryRes?.data ?? summaryRes ?? null);
    setError("");
  } catch (err) {
    console.error("Gagal mengambil data shift:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Setiap kali outlet yang dipilih berubah, ambil ulang semua data
  useEffect(() => {
    fetchAll(outletId);
  }, [outletId]);

  

  const handleToggleShift = async (cashier) => {
    const cashierId = cashier.id ?? cashier.userId ?? cashier.cashierId;
    const activeShiftId = cashier.activeShiftId ?? cashier.shiftId ?? cashier.shift?.id;
    const isActive = Boolean(activeShiftId);

    setActionLoadingId(cashierId);
    try {
      if (isActive) {
        await forceCloseShift(activeShiftId);
      } else {
        await forceOpenShift(cashierId);
      }
      await fetchAll(outletId);
      notification.success(isActive ? "Shift kasir berhasil diakhiri." : "Shift kasir berhasil dimulai.");
    } catch (err) {
      console.error("Gagal mengubah status shift:", err);
      notification.error(err.message || "Gagal mengubah status shift.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const summaryCards = useMemo(() => {
    const shiftAktif = cashiers.filter((c) => c.activeShiftId ?? c.shiftId ?? c.shift?.id).length;

    return [
      { label: "Shift Aktif", value: shiftAktif, icon: FiBriefcase },
      { label: "Shift Hari Ini", value: summary?.totalShift ?? shifts.length, icon: FiClock },
      {
        label: "Penjualan Hari Ini",
        value: formatRupiah(summary?.totalPenjualan ?? summary?.totalSales ?? 0),
        icon: FiDollarSign,
      },
    ];
  }, [cashiers, shifts, summary]);

  return (
    <div className="space-y-5">
      {/* Dropdown pilih outlet */}
      <div className="flex items-center justify-between">
        <div>
        </div>
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          value={outletId}
          onChange={(e) => setOutletId(e.target.value)}
        >
          <option value="">semua cabang</option>
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

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

        {loading ? (
          <div className="p-4 text-center text-sm text-slate-500">Memuat data...</div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-500">{error}</div>
        ) : cashiers.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">Belum ada kasir di outlet ini.</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {cashiers.map((cashier) => {
              const cashierId = cashier.id ?? cashier.userId ?? cashier.cashierId;
              const activeShiftId = cashier.activeShiftId ?? cashier.shiftId ?? cashier.shift?.id;
              const isActive = Boolean(activeShiftId);
              const outletName = cashier.outlet?.name ?? cashier.outletName ?? cashier.cabang ?? "-";

              return (
                <div key={cashierId} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                        <FiBriefcase size={15} />
                      </div>
                      <div>
                        <div className="text-[1rem] font-semibold text-slate-700">
                          {cashier.name ?? cashier.nama}
                        </div>
                        <div className="text-xs text-slate-500">{outletName}</div>
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-1 text-[0.72rem] font-medium ${
                        isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isActive ? "Sedang Aktif" : "Tersedia"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleShift(cashier)}
                    disabled={actionLoadingId === cashierId}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 ${
                      isActive ? "bg-red-500 hover:bg-red-600" : "bg-[#1d7ef2] hover:bg-[#176ed8]"
                    }`}
                  >
                    <FiClock size={15} />
                    {actionLoadingId === cashierId ? "Memproses..." : isActive ? "Tutup Shift" : "Buka Shift"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-sm text-slate-500">Memuat data...</td>
                  </tr>
                ) : shifts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-sm text-slate-500">Belum ada riwayat shift.</td>
                  </tr>
                ) : (
                  shifts.map((item) => {
                    const kasirNama =
                      item.cashier?.name ??
                      (typeof item.kasir === "string" ? item.kasir : item.kasir?.name) ??
                      item.user?.name ??
                      "-";
                    const dibuka = item.openedAt ?? item.dibuka;
                    const ditutup = item.closedAt ?? item.ditutup;
                    const status = ditutup ? "Ditutup" : "Aktif";

                    return (
                      <tr key={item.id} className="border-t border-slate-200 bg-white">
                        <td className="px-4 py-3 font-medium text-slate-700">{kasirNama}</td>
                        <td className="px-4 py-3">{formatJam(dibuka)}</td>
                        <td className="px-4 py-3">{formatJam(ditutup)}</td>
                        <td className="px-4 py-3">{formatRupiah(item.totalPenjualan ?? item.totalSales ?? 0)}</td>
                        <td className="px-4 py-3">{item.totalTransaksi ?? item.transactionCount ?? 0}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
                              status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {status}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShiftKasirAdmin;