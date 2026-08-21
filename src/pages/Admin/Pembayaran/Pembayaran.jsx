import { useEffect, useState } from "react";
import { useNotification } from "../../../components/ui/NotificationCenter";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin"
import PembayaranAdmin from "../../../components/Layouts/Admin/PembayaranAdmin"
import {FiPlus, FiX} from "react-icons/fi";
import { createPembayaran, updatePembayaran } from "../../../services/pembayaran.service";
import { getBranches } from "../../../services/branch.service";

const initialForm = {
  name: "",
  type: "CASH",
  isActive: "true",
  outletIds: [],  
  applyToAllOutlets: false,
};

const Pembayaran = ()=>{
    const notification = useNotification();
    const [showPembayaran, setShowPembayaran] = useState(false);
    const [editingPembayaran, setEditingPembayaran] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [outlet, setOutlet] = useState([]);
    const [Loading, setLoading] = useState(true);

    const fetchOutlets = async () => {
        setLoading(true);
        try {
          const data = await getBranches();
          const branchList = Array.isArray(data.data?.data)
                ? data.data.data
                : Array.isArray(data.data)
                ? data.data
                : [];
          setOutlet(branchList);
        } catch (err) {
          console.error("Gagal mengambil daftar produk:", err);
          setOutlet([]);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
      fetchOutlets();
    }, []);

    const resetForm = () => {
      setFormData(initialForm);
      setEditingPembayaran(null);
    };

    const openCreatePembayaran = () => {
      resetForm();
      setShowPembayaran(true);
    };

    const openEditPembayaran = (pembayaran) => {
      // Ambil SEMUA cabang yang terhubung, bukan cuma yang pertama
      const outletIds = (pembayaran.outletPaymentMethods ?? [])
        .map((item) => item.outletId)
        .filter(Boolean);

      setEditingPembayaran(pembayaran);
      setFormData({
        name: pembayaran.name ?? "",
        type: pembayaran.type ?? "CASH",
        isActive: String(pembayaran.isActive ?? true),
        outletIds,
        applyToAllOutlets: outletIds.length === 0, 
      });
      setShowPembayaran(true);
    };

    const handlePembayaranClose = () => {
      setShowPembayaran(false);
      resetForm();
    };

    const handleSaveSuccess = () => {
      setShowPembayaran(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleOutlet = (outletId) => {
      setFormData((prev) => {
        const isSelected = prev.outletIds.includes(outletId);
        return {
          ...prev,
          outletIds: isSelected
            ? prev.outletIds.filter((id) => id !== outletId)
            : [...prev.outletIds, outletId],
        };
      });
    };

    const handleToggleAllOutlets = (checked) => {
      setFormData((prev) => ({
        ...prev,
        applyToAllOutlets: checked,
        outletIds: checked ? [] : prev.outletIds,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!formData.applyToAllOutlets && formData.outletIds.length === 0) {
        notification.error("Pilih minimal satu cabang, atau centang \"Semua Cabang\".");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          name: formData.name,
          isActive: formData.isActive === "true",
          type: formData.type,
          outletIds: formData.applyToAllOutlets ? [] : formData.outletIds,
        };

        if (editingPembayaran) {
          await updatePembayaran(editingPembayaran.id, payload);
        } else {
          await createPembayaran(payload);
        }

        handleSaveSuccess();
        notification.success(editingPembayaran ? "Metode pembayaran berhasil diperbarui." : "Metode pembayaran berhasil ditambahkan.");
      } catch (error) {
        notification.error(error.message || "Gagal menyimpan pembayaran");
      } finally {
        setIsSubmitting(false);
      }
    };

    return(
        <SidebarAdmin>
            <div className="relative flex-1">
            <MainAdmin
                title="Manajemen Metode Pembayaran"
                subtitle="Kelola Metode Pembayaran yang tersedia"
                content={<PembayaranAdmin outlet={outlet} refreshKey={refreshKey} onEdit={openEditPembayaran}/>}
                icon={<FiPlus size={18} />}
                buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
                buttonLabel="Tambah Metode Pembayaran"
                onClick={openCreatePembayaran}
            />

            {showPembayaran && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                        <p className="text-sm font-semibold text-[#1c86ef]">Form Metode Pembayaran</p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-800">
                            {editingPembayaran ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran Baru"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Lengkapi data metode pembayaran dan pilih cabang yang berlaku.
                        </p>
                        </div>
                        <button
                        type="button"
                        onClick={handlePembayaranClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Tutup form"
                        >
                        <FiX size={18} />
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid gap-5 md:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-700">
                            <span className="mb-2 block">Metode Pembayaran</span>
                            <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                            placeholder="Contoh: Cash, QRIS, Transfer BCA"
                            />
                        </label>

                        <label className="block text-sm font-medium text-slate-700">
                            <span className="mb-2 block">Status</span>
                            <select
                            name="isActive"
                            value={formData.isActive}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                            >
                            <option value="true">Aktif</option>
                            <option value="false">Nonaktif</option>
                            </select>
                        </label>

                        <label className="block text-sm font-medium text-slate-700">
                            <span className="mb-2 block">Tipe Pembayaran</span>
                            <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                            >
                            <option value="CASH">CASH</option>
                            <option value="E_WALLET">E_WALLET</option>
                            <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                            <option value="CREDIT_CARD">CREDIT_CARD</option>
                            <option value="OTHER">OTHER</option>
                            </select>
                        </label>

                        {/* ✅ Multi-pilih cabang + toggle "Semua Cabang" */}
                        <div className="block text-sm font-medium text-slate-700">
                            <div className="mb-2 flex items-center justify-between">
                            <span>Cabang</span>
                            <label className="flex items-center gap-2 text-xs font-normal text-slate-500">
                                <input
                                type="checkbox"
                                checked={formData.applyToAllOutlets}
                                onChange={(event) => handleToggleAllOutlets(event.target.checked)}
                                />
                                Semua Cabang
                            </label>
                            </div>
                            <div className={`max-h-36 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 ${formData.applyToAllOutlets ? "opacity-50" : ""}`}>
                            {outlet.length === 0 ? (
                                <p className="text-xs text-slate-400">Belum ada data cabang.</p>
                            ) : (
                                outlet.map((cabang) => (
                                <label key={cabang.id} className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                    type="checkbox"
                                    disabled={formData.applyToAllOutlets}
                                    checked={formData.outletIds.includes(cabang.id)}
                                    onChange={() => handleToggleOutlet(cabang.id)}
                                    />
                                    {cabang.name}
                                </label>
                                ))
                            )}
                            </div>
                        </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                          <button
                            type="button"
                            onClick={handlePembayaranClose}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2xl bg-[#1c86ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isSubmitting ? "Menyimpan..." : editingPembayaran ? "Simpan Perubahan" : "Simpan Metode Pembayaran"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
        </SidebarAdmin>
    )
}

export default Pembayaran