import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import KategoriAdmin from "../../../components/Layouts/Admin/KategoriAdmin";
import {FiPlus, FiX} from "react-icons/fi";
import { useState } from "react";
import { createCategory, updateCategory } from "../../../services/category.service";

const initialForm = {
  name: "",
  total: "",
  status: "",
};

const Kategori = () => {
    const [showCategory, setShowCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
    setFormData(initialForm);
    setEditingCategory(null);
    };

    const openCreateCategory = () => {
    resetForm();
    setShowCategory(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name ?? "",
      total: category.total ?? "",
      status: category.status ?? "ACTIVE",
    });
    setShowCategory(true);
  };

  const handleCategoryClose = () => {
    setShowCategory(false);
    resetForm();
  };

  const handleSaveSuccess = () => {
    setShowCategory(false);
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
          total: formData.total,
          
        };
        console.log("PAYLOAD YANG DIKIRIM:", payload); 
  
        if (editingCategory) {
          await updateCategory(editingCategory.id, {
            ...payload,
            status: formData.status,
          });
        } else {
          await createCategory(payload);
        }
  
        handleSaveSuccess();
      } catch (error) {
        console.log("ERROR DETAIL:", error);
        alert(error.message || "Gagal menyimpan Category");
      } finally {
        setIsSubmitting(false);
      }
    };



  return (
    <SidebarAdmin>
      <div className="relative flex-1">
      <MainAdmin
        title="Manajement Kategori"
        subtitle="Kelola kategori produk"
        content={<KategoriAdmin refreshKey={refreshKey} onEdit={openEditCategory} />}
          icon = {<FiPlus size={18} />}
                buttonClassName = "inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc] cursor-pointer"
                buttonLabel = "Tambah kategori"
                onClick={openCreateCategory}
      />
      {showCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                  <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1c86ef]">Form kategori</p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-800">
                          {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          Lengkapi data Kategori agar outlet Anda lebih mudah dikelola.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCategoryClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Tutup form"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
      
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid gap-5 md:grid-cols-2">
                        <label className="block text-sm font-medium text-slate-700">
                          <span className="mb-2 block">Nama kategori</span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                            placeholder="Contoh: Makanan"
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
                          <span className="mb-2 block">username</span>
                          <input
                            type="text"
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                            placeholder="Masukkan Username kategori"
                          />
                        </label>
      
              
                      </div>
      
                      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                        <button
                          type="button"
                          onClick={handleCategoryClose}
                          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-2xl bg-[#1c86ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmitting ? "Menyimpan..." : editingCategory ? "Simpan Perubahan" : "Simpan Cabang"}
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

export default Kategori;