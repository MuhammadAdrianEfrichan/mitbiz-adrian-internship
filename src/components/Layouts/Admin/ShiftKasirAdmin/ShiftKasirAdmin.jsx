import { useEffect, useState, useMemo } from "react";
import { FiBriefcase, FiEye, FiClock, FiDollarSign, FiX } from "react-icons/fi";
import {
  getCashiersStatus,
  getShifts,
  getShiftToday,
  forceOpenShift,
  forceCloseShift,
} from "../../../../services/shift..service";
import { getBranches } from "../../../../services/branch.service";
import { getTransaction } from "../../../../services/transaction.service";
import { useNotification } from "../../../ui/NotificationCenter";

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

const formatJam = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.transactions)) return res.data.transactions;
  if (Array.isArray(res?.data?.data?.transactions)) return res.data.data.transactions;
  return [];
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
  const [selectedShift, setSelectedShift] = useState(null);

  // Ambil daftar outlet sekali di awal, untuk isi dropdown
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await getBranches();
        const list = unwrapList(res);
        setOutlets(list);
      } catch (err) {
        console.error("Gagal mengambil daftar outlet:", err);
        setError(err.message);
      }
    };
    fetchOutlets();
  }, []);

  const fetchAll = async (id) => {
    const selectedOutlets = id ? outlets.filter((outlet) => String(outlet.id) === String(id)) : outlets;
    if (selectedOutlets.length === 0) return;
    setLoading(true);
    try {
      const outletResults = await Promise.all(selectedOutlets.map(async (outlet) => {
        const [cashiersRes, shiftsRes, summaryRes, transactionsRes] = await Promise.all([
          getCashiersStatus(outlet.id),
          getShifts(outlet.id),
          getShiftToday(outlet.id),
          getTransaction({ outletId: outlet.id }),
        ]);

        const completedTransactions = unwrapList(transactionsRes).filter(
          (transaction) => String(transaction.status ?? transaction.paymentStatus ?? "").toUpperCase() === "COMPLETED"
        );
        const statsByShift = completedTransactions.reduce((acc, transaction) => {
          const shiftId = transaction.shiftId;
          if (!shiftId) return acc;
          if (!acc[shiftId]) acc[shiftId] = { sales: 0, count: 0 };
          acc[shiftId].sales += Number(transaction.totalAmount ?? transaction.total ?? 0);
          acc[shiftId].count += 1;
          return acc;
        }, {});
        const rawShifts = unwrapList(shiftsRes);
        const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? summaryRes ?? {};

        return {
          cashiers: unwrapList(cashiersRes).map((cashier) => ({ ...cashier, outletName: cashier.outlet?.name ?? outlet.name })),
          shifts: rawShifts.map((shift) => ({
            ...shift,
            outletName: shift.outlet?.name ?? outlet.name,
            totalPenjualan: statsByShift[shift.id]?.sales ?? shift.totalPenjualan ?? 0,
            totalTransaksi: statsByShift[shift.id]?.count ?? shift.totalTransaksi ?? 0,
          })),
          summary: summaryData,
        };
      }));

      const allCashiers = outletResults.flatMap((result) => result.cashiers);
      const allShifts = outletResults.flatMap((result) => result.shifts);
      const allSummaries = outletResults.map((result) => result.summary);
      setCashiers(allCashiers);
      setShifts(allShifts);
      setSummary({
        totalShift: allSummaries.reduce((sum, item) => sum + Number(item.totalShift ?? 0), 0) || allShifts.length,
        totalPenjualan: allSummaries.reduce((sum, item) => sum + Number(item.totalPenjualan ?? item.totalSales ?? 0), 0)
          || allShifts.reduce((sum, shift) => sum + Number(shift.totalPenjualan ?? 0), 0),
      });
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
  }, [outletId, outlets]);

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
    const totalPenjualanShift = shifts.reduce((sum, s) => sum + Number(s.totalPenjualan ?? 0), 0);

    return [
      { label: "Shift Aktif", value: shiftAktif, icon: FiBriefcase },
      { label: "Shift Hari Ini", value: summary?.totalShift ?? shifts.length, icon: FiClock },
      {
        label: "Penjualan Hari Ini",
        value: formatRupiah(summary?.totalPenjualan ?? summary?.totalSales ?? totalPenjualanShift),
        icon: FiDollarSign,
      },
    ];
  }, [cashiers, shifts, summary]);

  return (
    <div className="space-y-5">
      {/* Dropdown pilih outlet */}
      <div className="flex items-center justify-between">
        <div></div>
        <select
          className="min-w-56 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-700 focus:border-blue-500 focus:outline-none"
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
                            onClick={() => setSelectedShift(item)}
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

      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-medium text-blue-600">Detail Shift</p>
                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  {selectedShift.cashier?.name ?? selectedShift.kasir?.name ?? selectedShift.user?.name ?? selectedShift.kasir ?? "Kasir"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShift(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup detail shift"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">Cabang</p><p className="mt-1 font-semibold text-slate-800">{selectedShift.outletName ?? selectedShift.outlet?.name ?? "-"}</p></div>
              <div><p className="text-slate-500">Status</p><p className="mt-1 font-semibold text-slate-800">{selectedShift.closedAt ?? selectedShift.ditutup ? "Ditutup" : "Aktif"}</p></div>
              <div><p className="text-slate-500">Waktu Dibuka</p><p className="mt-1 font-semibold text-slate-800">{formatJam(selectedShift.openedAt ?? selectedShift.dibuka ?? selectedShift.started_at)}</p></div>
              <div><p className="text-slate-500">Waktu Ditutup</p><p className="mt-1 font-semibold text-slate-800">{formatJam(selectedShift.closedAt ?? selectedShift.ditutup ?? selectedShift.ended_at)}</p></div>
              <div><p className="text-slate-500">Total Penjualan</p><p className="mt-1 text-lg font-bold text-slate-900">{formatRupiah(selectedShift.totalPenjualan ?? selectedShift.totalSales ?? 0)}</p></div>
              <div><p className="text-slate-500">Total Transaksi</p><p className="mt-1 text-lg font-bold text-slate-900">{selectedShift.totalTransaksi ?? selectedShift.transactionCount ?? 0}</p></div>
            </div>

            <button type="button" onClick={() => setSelectedShift(null)} className="mt-6 w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftKasirAdmin;