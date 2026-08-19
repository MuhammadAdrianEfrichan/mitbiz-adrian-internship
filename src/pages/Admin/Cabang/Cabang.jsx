import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import CabangAdmin from "../../../components/Layouts/Admin/CabangAdmin";
import { createBranch, updateBranch } from "../../../services/branch.service";
import { FiPlus, FiX } from "react-icons/fi";
import { useState } from "react";
import { useNotification } from "../../../components/ui/NotificationCenter";

const initialForm = {
  name: "",
  address: "",
  phone: "",
  status: "",
};

const Cabang = () => {
  const notification = useNotification();
  const [showCabang, setShowCabang] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingBranch(null);
  };

  const openCreateCabang = () => {
    resetForm();
    setShowCabang(true);
  };

  const openEditCabang = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name ?? "",
      address: branch.address ?? branch.alamat ?? "",
      phone: branch.phone ?? "",
      status: branch.status ?? "ACTIVE",
    });
    setShowCabang(true);
  };

  const handleCabangClose = () => {
    setShowCabang(false);
    resetForm();
  };

  const handleSaveSuccess = () => {
    setShowCabang(false);
    resetForm();
    setRefreshKey((prev) => prev + 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        
      };
      console.log("PAYLOAD YANG DIKIRIM:", payload); 

      if (editingBranch) {
        await updateBranch(editingBranch.id, {
          ...payload,
          status: formData.status,
        });
      } else {
        await createBranch(payload);
      }

      handleSaveSuccess();
      notification.success(editingBranch ? "Cabang berhasil diperbarui." : "Cabang berhasil ditambahkan.");
    } catch (error) {
      console.log("ERROR DETAIL:", error);
      notification.error(error.message || "Gagal menyimpan cabang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarAdmin>
      <div className="relative flex-1">
        <MainAdmin
          title="Cabang"
          subtitle="Kelola data cabang dan status operasional"
          content={<CabangAdmin refreshKey={refreshKey} onEdit={openEditCabang} />}
          icon={<FiPlus size={18} />}
          buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc] cursor-pointer"
          buttonLabel="Tambah Cabang"
          onClick={openCreateCabang}
        />



        {/* redesain alert untuk mengkonfirmasi selesai di tambahkan dan error */}


        {showCabang && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1c86ef]">Form cabang</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-800">
                    {editingBranch ? "Edit Cabang" : "Tambah Cabang Baru"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Lengkapi data cabang agar outlet Anda lebih mudah dikelola.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCabangClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Tutup form"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    <span className="mb-2 block">Nama Cabang</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                      placeholder="Contoh: Cabang Bandung"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    <span className="mb-2 block">Status</span>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                    >
                      <option value="ACTIVE">Aktif</option>
                      <option value="INACTIVE">Nonaktif</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                    <span className="mb-2 block">Alamat</span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                      placeholder="Masukkan alamat lengkap cabang"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                    <span className="mb-2 block">Nomor Telepon</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                      placeholder="Contoh: 021-12345678"
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={handleCabangClose}
                    className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-2xl bg-[#1c86ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Menyimpan..." : editingBranch ? "Simpan Perubahan" : "Simpan Cabang"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SidebarAdmin>
  );
};

export default Cabang;