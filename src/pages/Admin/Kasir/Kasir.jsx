import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import KasirAdmin from "../../../components/Layouts/Admin/KasirAdmin";
import { getBranches } from "../../../services/branch.service";
import { ALL_PERMISSIONS } from "../../../constant/permissionts";
import { tambahKasir, getKasir, updateKasir, deleteKasir, searchKasir } from "../../../services/kasir.service";
import { createRoles, getRoles, updateRoles, deleteRoles } from "../../../services/role.service";
import { FiPlus, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNotification } from "../../../components/ui/NotificationCenter";

const initialKaryawanForm = {
    name: "",
    username: "",
    email: "",
    password: "",
    outletId: "",
    roleId: "",
};

const initialRoleForm = {
    name: "",
    permissions: [],
};

const Kasir = () => {
    const notification = useNotification();
    // ===== Data referensi =====
    const [branches, setBranches] = useState([]);
    const [branchesLoading, setBranchesLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // ===== Modal Karyawan =====
    const [showKaryawanModal, setShowKaryawanModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [karyawanForm, setKaryawanForm] = useState(initialKaryawanForm);
    const [isSubmittingKaryawan, setIsSubmittingKaryawan] = useState(false);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleForm, setRoleForm] = useState(initialRoleForm);
    const [isSubmittingRole, setIsSubmittingRole] = useState(false);

    /* ================= FETCH DATA REFERENSI ================= */
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
        } finally {
            setBranchesLoading(false);
        }
    };

    const fetchRoles = async () => {
        setRolesLoading(true);
        try {
            const result = await getRoles(); // fetch-based, return body JSON langsung
            const roleList = Array.isArray(result.data) ? result.data : [];
            setRoles(roleList);
        } catch (err) {
            console.error("Gagal mengambil daftar role:", err);
            setRoles([]);
        } finally {
            setRolesLoading(false);
        }
    };

    useEffect(() => {
        fetchCabang();
        fetchRoles();
    }, [refreshKey]);

    const resetKaryawanForm = () => {
        setKaryawanForm(initialKaryawanForm);
        setEditingUser(null);
    };

    const openCreateKaryawanModal = () => {
        resetKaryawanForm();
        setShowKaryawanModal(true);
    };

    const openEditKaryawanModal = (user) => {
        setEditingUser(user);
        setKaryawanForm({
            name: user.name ?? "",
            username: user.username ?? "",
            email: user.email ?? "",
            password: "",
            outletId: user.outletId ?? "",
            roleId: user.roleId ?? "",
        });
        setShowKaryawanModal(true);
    };

    const handleCloseKaryawanModal = () => {
        setShowKaryawanModal(false);
        resetKaryawanForm();
    };

    const handleKaryawanChange = (e) => {
        const { name, value } = e.target;
        setKaryawanForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitKaryawan = async (e) => {
        e.preventDefault();
        setIsSubmittingKaryawan(true);
        try {
            if (editingUser) {
                const payload = {
                    name: karyawanForm.name,
                    username: karyawanForm.username,
                    email: karyawanForm.email,
                    outletId: karyawanForm.outletId,
                    roleId: karyawanForm.roleId,
                };
                if (karyawanForm.password) payload.password = karyawanForm.password;
                await updateKasir(editingUser.id, payload); // PATCH /staff/{id}
            } else {
                await tambahKasir(karyawanForm); // POST /staff
            }
            handleCloseKaryawanModal();
            setRefreshKey((prev) => prev + 1);
            notification.success(editingUser ? "Data karyawan berhasil diperbarui." : "Karyawan berhasil ditambahkan.");
        } catch (err) {
            notification.error(err.message || "Gagal menyimpan data karyawan.");
            console.error(err);
        } finally {
            setIsSubmittingKaryawan(false);
        }
    };

    /* ================= HANDLER: ROLE (endpoint /roles) ================= */
    const resetRoleForm = () => {
        setRoleForm(initialRoleForm);
        setEditingRole(null);
    };

    const openCreateRoleModal = () => {
        resetRoleForm();
        setShowRoleModal(true);
    };

    const openEditRoleModal = (role) => {
        setEditingRole(role);
        setRoleForm({
            name: role.name ?? "",
            permissions: role.permissions ?? [],
        });
        setShowRoleModal(true);
    };

    const handleCloseRoleModal = () => {
        setShowRoleModal(false);
        resetRoleForm();
    };

    const handleRoleNameChange = (e) => {
        setRoleForm((prev) => ({ ...prev, name: e.target.value }));
    };

    const handlePermissionToggle = (key) => {
        setRoleForm((prev) => {
            const isChecked = prev.permissions.includes(key);
            return {
                ...prev,
                permissions: isChecked
                    ? prev.permissions.filter((p) => p !== key)
                    : [...prev.permissions, key],
            };
        });
    };

    const handleSubmitRole = async (e) => {
        e.preventDefault();
        setIsSubmittingRole(true);
        try {
            const payload = {
                name: roleForm.name,
                permissions: roleForm.permissions,
            };
            if (editingRole) {
                await updateRoles(editingRole.id, payload); // PATCH /roles/{id}
            } else {
                await createRoles(payload); // POST /roles
            }
            handleCloseRoleModal();
            setRefreshKey((prev) => prev + 1);
            notification.success(editingRole ? "Role berhasil diperbarui." : "Role berhasil ditambahkan.");
        } catch (err) {
            notification.error(err.message || "Gagal menyimpan role.");
            console.error(err);
        } finally {
            setIsSubmittingRole(false);
        }
    };

    const handleDeleteRole = async (role) => {
        notification.confirm(`Role "${role.name}" dan hak aksesnya akan dihapus.`, async () => {
            try {
                await deleteRoles(role.id); // DELETE /roles/{id}
                setRefreshKey((prev) => prev + 1);
                notification.success("Role berhasil dihapus.");
            } catch (err) {
                notification.error(err.message || "Gagal menghapus role.");
            }
        }, { actionLabel: "Hapus" });
    };

    return (
        <SidebarAdmin>
            <div className="relative flex-1">
                <MainAdmin
                    title="Manajemen Karyawan"
                    subtitle="Kelola data karyawan, role, dan akses mereka"
                    content={
                        <KasirAdmin
                            refreshKey={refreshKey}
                            branches={branches}
                            roles={roles}
                            rolesLoading={rolesLoading}
                            onEdit={openEditKaryawanModal}
                            onEditRole={openEditRoleModal}
                            onDeleteRole={handleDeleteRole}
                            onAddRole={openCreateRoleModal}
                        />
                    }
                    icon={<FiPlus size={18} />}
                    buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc] cursor-pointer"
                    buttonLabel="Tambah Karyawan"
                    onClick={openCreateKaryawanModal}
                />

                {/* ============ MODAL: TAMBAH/EDIT KARYAWAN ============ */}
                {showKaryawanModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-[#1c86ef]">
                                        {editingUser ? "Form edit Karyawan" : "Form tambah Karyawan"}
                                    </p>
                                    <h2 className="mt-1 text-2xl font-bold text-slate-800">
                                        {editingUser ? "Edit Karyawan" : "Tambah Karyawan"}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Lengkapi data karyawan dan pilih role akses mereka.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseKaryawanModal}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmitKaryawan}>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        <span className="mb-2 block">Nama Karyawan</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={karyawanForm.name}
                                            onChange={handleKaryawanChange}
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                            placeholder="Contoh: Budi Santoso"
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-700">
                                        <span className="mb-2 block">Username</span>
                                        <input
                                            type="text"
                                            name="username"
                                            value={karyawanForm.username}
                                            onChange={handleKaryawanChange}
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                            placeholder="budisantoso"
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-700">
                                        <span className="mb-2 block">Email</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={karyawanForm.email}
                                            onChange={handleKaryawanChange}
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                            placeholder="budi@gmail.com"
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-700">
                                        <span className="mb-2 block">Cabang</span>
                                        <select
                                            name="outletId"
                                            value={karyawanForm.outletId}
                                            onChange={handleKaryawanChange}
                                            required
                                            disabled={branchesLoading}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                        >
                                            <option value="" disabled>
                                                {branchesLoading ? "Memuat cabang..." : "Pilih cabang"}
                                            </option>
                                            {branches.map((branch) => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {/* Dropdown Role — WAJIB kirim roleId sesuai dokumentasi POST /staff */}
                                    <label className="block text-sm font-medium text-slate-700">
                                        <span className="mb-2 block">Role</span>
                                        <select
                                            name="roleId"
                                            value={karyawanForm.roleId}
                                            onChange={handleKaryawanChange}
                                            required
                                            disabled={rolesLoading}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                        >
                                            <option value="" disabled>
                                                {rolesLoading
                                                    ? "Memuat role..."
                                                    : roles.length === 0
                                                    ? "Belum ada role — tambahkan dulu"
                                                    : "Pilih role"}
                                            </option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                        <span className="mb-2 block">Password</span>
                                        <input
                                            type="password"
                                            name="password"
                                            value={karyawanForm.password}
                                            onChange={handleKaryawanChange}
                                            required={!editingUser}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                            placeholder={editingUser ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                                        />
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                    <button
                                        type="button"
                                        onClick={handleCloseKaryawanModal}
                                        className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingKaryawan}
                                        className="rounded-2xl bg-[#1c86ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSubmittingKaryawan
                                            ? "Menyimpan..."
                                            : editingUser
                                            ? "Simpan Perubahan"
                                            : "Simpan Karyawan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ============ MODAL: TAMBAH/EDIT ROLE ============ */}
                {showRoleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-[#1c86ef]">
                                        {editingRole ? "Form edit Role" : "Form tambah Role"}
                                    </p>
                                    <h2 className="mt-1 text-2xl font-bold text-slate-800">
                                        {editingRole ? "Edit Role" : "Tambah Role Baru"}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Role ini akan muncul di daftar sebelah kiri, siap dipilih saat menambah karyawan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseRoleModal}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmitRole}>
                                <label className="block text-sm font-medium text-slate-700">
                                    <span className="mb-2 block">Nama Role</span>
                                    <input
                                        type="text"
                                        value={roleForm.name}
                                        onChange={handleRoleNameChange}
                                        required
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1c86ef] focus:bg-white"
                                        placeholder="Contoh: Supervisor"
                                    />
                                </label>

                                <div>
                                    <span className="mb-3 block text-sm font-medium text-slate-700">
                                        Hak Akses (Permissions)
                                    </span>
                                    <div className="grid gap-3 md:grid-cols-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 p-4">
                                        {ALL_PERMISSIONS.map((perm) => (
                                            <label
                                                key={perm.key}
                                                className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={roleForm.permissions.includes(perm.key)}
                                                    onChange={() => handlePermissionToggle(perm.key)}
                                                    className="h-4 w-4 rounded border-slate-300 text-[#1c86ef] focus:ring-[#1c86ef]"
                                                />
                                                {perm.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                    <button
                                        type="button"
                                        onClick={handleCloseRoleModal}
                                        className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingRole}
                                        className="rounded-2xl bg-[#1c86ef] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:opacity-70"
                                    >
                                        {isSubmittingRole ? "Menyimpan..." : "Simpan Role"}
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