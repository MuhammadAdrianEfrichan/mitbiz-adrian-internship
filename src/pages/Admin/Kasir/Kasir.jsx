import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import KasirAdmin from "../../../components/Layouts/Admin/KasirAdmin";
import { getKasir, tambahKasir, updateKasir } from "../../../services/kasir.service";
import { FiPlus, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getBranches } from "../../../services/branch.service";

const initialForm = {
    name: "",
    username: "",
    email: "",
    password: "",
    outletId : "",
};

const Kasir = () => {

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [branches, setBranches] = useState([]);
    const [branchesLoading, setBranchesLoading] = useState(true); 


    const fetchCabang = async () => {
      setBranchesLoading(true);
        try {
            const data = await getBranches();
            const branchList = Array.isArray(data.data?.data)
                ? data.data.data
                : Array.isArray(data.data)
                ? data.data
                : [];
            setBranches(branchList);
        } catch (err) {
            console.error("Gagal mengambil daftar cabang:", err);
            setBranches([]);
        }finally {
            setBranchesLoading(false);
        }
    };

     useEffect(() => {
        fetchCabang();
    }, []);
   

    const resetForm = () => {
        setFormData(initialForm);
        setEditingUser(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

     const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
            password: "", 
            outletId: user.outletId ?? "",
        });
        setShowModal(true);
    };

      const handleClose = () => {
        setShowModal(false);
        resetForm();
    };


    const handleSaveSuccess = () => {
    resetForm();
    setRefreshKey((prev) => prev + 1);
  };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingUser) {
                const payload = { 
                  name: formData.name, 
                  username: formData.username, 
                  email: formData.email,
                  outletId: formData.outletId,
                };
                console.log("PAYLOAD YANG DIKIRIM:", payload); 
                if (formData.password) payload.password = formData.password; 
                await updateKasir(editingUser.id, payload);
            } else {
                await tambahKasir(formData);
            }
            handleClose();
            handleSaveSuccess();
        } catch (err) {
            alert( "Gagal menyimpan data kasir");
            console.log (err.message)
        } finally {
            setIsSubmitting(false);
        }
    };

   





  return (
    <SidebarAdmin>
      <div className="relative flex-1">
      <MainAdmin
        title="Manajemen Kasir"
        subtitle="Kelola data kasir dan akses mereka"
        content={<KasirAdmin 
                refreshKey={refreshKey}
                branches={branches}
                onEdit={openEditModal}
                />}
        icon={<FiPlus size={18} />}
        buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc] cursor-pointer"
        buttonLabel="Tambah Kasir"
        onClick={openCreateModal}
      />
        {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#1c86ef]">Form tambah Kasir</p>
                          <h2 className="mt-1 text-2xl font-bold text-slate-800">
                            {editingUser ? "Edit Kasir" : "Tambah kasir"}
                          </h2>
                          <p className="mt-2 text-sm text-slate-500">
                            Lengkapi data Kasir agar outlet Anda lebih mudah dikelola.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Tutup form"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
        
                      <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid gap-5 md:grid-cols-2">
                          <label className="block text-sm font-medium text-slate-700">
                            <span className="mb-2 block">Nama Kasir</span>
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
                            <span className="mb-2 block">username</span>
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              required
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                              placeholder="kasir 1"
                            />
                          </label>
                          <label className="block text-sm font-medium text-slate-700">
                            <span className="mb-2 block">Email</span>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                              placeholder="kasir1@gmail.com"
                            />
                          </label>
        
                          <label className="block text-sm font-medium text-slate-700">
                            <span className="mb-2 block">Cabang</span>
                            <select
                              name="outletId"
                              value={formData.outletId}
                              onChange={handleChange}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                            >
                              <option value="" disabled>Pilih cabang</option>
                                  {branches.map((branch) => (
                                  <option key={branch.id} value={branch.id}>
                                  {branch.name}
                                  </option>
                                  ))}
                            </select>
                          </label>
        
                          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                            <span className="mb-2 block">Password</span>
                            <input
                              type = "password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required={!editingUser}
                              rows="3"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                              placeholder="Minimal 8 karakter"
                            />
                          </label>
        
                        </div>
        
                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                          <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-2xl bg-[#1c86ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isSubmitting ? "Menyimpan..." : editingUser ? "Simpan Perubahan" : "Simpan Cabang"}
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

export default Kasir;