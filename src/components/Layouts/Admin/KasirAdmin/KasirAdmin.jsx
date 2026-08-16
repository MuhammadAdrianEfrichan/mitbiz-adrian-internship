import { useEffect, useState, useMemo } from "react";
import { FiEdit2, FiSearch, FiTrash2, FiUsers, FiPlus } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { getKasir, searchKasir, deleteKasir } from "../../../../services/kasir.service";

const KasirAdmin = ({
    refreshKey,
    onEdit,
    onEditRole,
    onDeleteRole,
    onAddRole,
    branches = [],
    roles = [],
    rolesLoading = false,
}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRoleId, setSelectedRoleId] = useState(null); // null = "Semua"
    const [searchParams, setSearchParams] = useSearchParams();

    /* Fetch KARYAWAN dari /staff — sumber tabel bawah */
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const keyword = searchParams.get("search");
            const result = keyword ? await searchKasir(keyword) : await getKasir();
            const allUsers = Array.isArray(result.data?.data) ? result.data.data : [];
        setUsers(allUsers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshKey, searchParams.get("search")]);

    const roleCounts = useMemo(() => {
        const counts = {};
        users.forEach((u) => {
            if (u.roleId) counts[u.roleId] = (counts[u.roleId] || 0) + 1;
        });
        return counts;
    }, [users]);

    const filteredUsers = useMemo(() => {
        if (!selectedRoleId) return users;
        return users.filter((u) => u.roleId === selectedRoleId);
    }, [users, selectedRoleId]);

    const selectedRole = roles.find((r) => r.id === selectedRoleId);

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus karyawan ini?")) return;
        try {
            await deleteKasir(id);
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSearch = (value) => {
        setSearchParams(value ? { search: value } : {});
    };

    return (
        <div className="flex min-h-[calc(100vh-120px)] gap-7 px-2 py-2">
            {/* ================= SIDEBAR: DAFTAR ROLE ================= */}
            <aside className="w-75 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-[1.1rem] font-semibold text-slate-800">Daftar Role</h2>
                </div>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => setSelectedRoleId(null)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                            selectedRoleId === null
                                ? "border-blue-500 bg-blue-50/70"
                                : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                A
                            </div>
                            <div>
                                <p className="text-base font-medium text-slate-800">Semua</p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <FiUsers size={12} />
                                    {users.length} Pengguna
                                </div>
                            </div>
                        </div>
                    </button>

                    {rolesLoading ? (
                        <p className="px-2 text-sm text-slate-400">Memuat role...</p>
                    ) : roles.length === 0 ? (
                        <p className="px-2 text-sm text-slate-400">
                            Belum ada role. Klik tombol di bawah untuk menambahkan.
                        </p>
                    ) : (
                        roles.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRoleId(role.id)}
                                className={`group flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 transition ${
                                    selectedRoleId === role.id
                                        ? "border-blue-500 bg-blue-50/70"
                                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                        {role.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-medium text-slate-800">{role.name}</p>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                            <FiUsers size={12} />
                                            {roleCounts[role.id] || 0} Pengguna
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditRole?.(role);
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
                                        aria-label={`Edit role ${role.name}`}
                                    >
                                        <FiEdit2 size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteRole?.(role);
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-100"
                                        aria-label={`Hapus role ${role.name}`}
                                    >
                                        <FiTrash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    type="button"
                    onClick={onAddRole}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
                >
                    <FiPlus size={18} />
                    Tambah Role Baru
                </button>
            </aside>

            {/* ================= TABEL: KARYAWAN ================= */}
            <section className="flex-1 rounded-2xl border-[3px] border-[#1a7fe8] bg-white p-4 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-[1.05rem] font-semibold text-slate-800">
                        {selectedRole ? `Role - ${selectedRole.name}` : "Semua Karyawan"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {filteredUsers.length} karyawan {selectedRole ? "dengan role ini" : "terdaftar"}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="relative block">
                        <span className="sr-only">Cari karyawan</span>
                        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                            <FiSearch size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari karyawan berdasarkan nama atau username..."
                            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                            value={searchParams.get("search") || ""}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </label>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                    {loading ? (
                        <p className="px-5 py-6 text-slate-500">Memuat data...</p>
                    ) : error ? (
                        <p className="px-5 py-6 text-red-500">{error}</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="px-5 py-6 text-slate-500">Belum ada karyawan.</p>
                    ) : (
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Cabang</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-t border-slate-200 bg-white text-sm text-slate-700">
                                        <td className="px-4 py-4">{user.name}</td>
                                        <td className="px-4 py-4">{user.username}</td>
                                        <td className="px-4 py-4">
                                            {roles.find((r) => r.id === user.roleId)?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            {branches.find((b) => b.id === user.outletId)?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                                    aria-label={`Edit ${user.name}`}
                                                    onClick={() => onEdit(user)}
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                                                    aria-label={`Hapus ${user.id}`}
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
};

export default KasirAdmin;