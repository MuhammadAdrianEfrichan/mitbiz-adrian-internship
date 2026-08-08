import { useEffect, useState } from "react";
import { FiEdit2, FiSearch, FiTrash2, FiUsers, FiPlus } from "react-icons/fi";
import { deleteKasir, getKasir } from "../../../../services/kasir.service";

const roles = [
  {
    name: "Kasir",
    status: "Aktif",
    count: 2,
  },
  {
    name: "Supervisor",
    status: "Aktif",
    count: 0,
  },
];


const KasirAdmin = ({refreshKey, onEdit, branches=[]}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    console.log("Tipe branches:", typeof branches, "isArray:", Array.isArray(branches), "value:", branches);
     console.log("BRANCHES PROP DI KASIRADMIN:", branches); 

    const totalKasir = users.length;

   const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getKasir();
            console.warn("🔥 RESPONSE BRANCHES:", data);
            console.log("RESPONSE BRANCHES:", JSON.stringify(data, null, 2));
            const allUsers = Array.isArray(data.data?.data)
                ? data.data.data
                : Array.isArray(data.data)
                ? data.data
                : [];
            const cashiers = allUsers.filter((u) => u.role === "STAFF");
            setUsers(cashiers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus kasir ini?")) return;
        try {
            await deleteKasir(id);
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    //  if (loading) return <p>Memuat data kasir...</p>;
    // if (error) return <p className="text-red-500">{error}</p>;
    
  return (
    <div className="flex min-h-[calc(100vh-120px)] gap-7 px-2 py-2">
      <aside className="w-75 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
        </div>

        <div className="mb-4">
          <h2 className="text-[1.1rem] font-semibold text-slate-800">Daftar Role</h2>
        </div>

        <div className="space-y-3">
          {roles.map(({ name, status, count }) => (
            <div
              key={name}
              className={`flex items-center justify-between rounded-xl border px-3 py-3 ${
                name === "Kasir"
                  ? "border-blue-500 bg-blue-50/70"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-slate-700">{name.charAt(0)}</div>
                <div>
                  <p className="text-base font-medium text-slate-800">{name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <FiUsers size={12} />
                      {count} Pengguna
                    </span>
                  </div>
                </div>
              </div>

              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                {status}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <FiPlus size={18} />
          Tambah Role Baru
        </button>
      </aside>

      <section className="flex-1 rounded-2xl border-[3px] border-[#1a7fe8] bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
        <div className="mb-5">
        <h2 className="text-[1.05rem] font-semibold text-slate-800">Role - Kasir</h2>
        <p className="text-sm text-slate-500">{totalKasir} pengguna dengan role ini</p>
        </div>
        </div>

        </div>

       

        <div className="mb-4">
          <label className="relative block">
            <span className="sr-only">Cari kasir</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari kasir berdasarkan nama atau username..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-200 bg-white text-sm text-slate-700">
                  <td className="px-4 py-4">{user.name}</td>
                  <td className="px-4 py-4">{user.userName}</td>
                  <td className="px-4 py-4">{(branches ?? []).find((b) => b.id === user.outletId)?.name ?? "-"}</td>
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
        </div>
      </section>
    </div>
  );
};

export default KasirAdmin;