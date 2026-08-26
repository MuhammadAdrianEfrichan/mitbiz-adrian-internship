import { FiEdit2, FiEye, FiTrash2, FiBriefcase, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { deleteBranch, getBranches } from "../../../../services/Admin/branch.service";
import { useEffect, useState } from "react";
import { useNotification } from "../../../ui/NotificationCenter";



const CabangAdmin = ({refreshKey, onEdit}) => {
  const notification = useNotification();
  

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const totalCabang = branches.length;

    const cabangAktif = branches.filter(
    (branch) => branch.status === "ACTIVE"
  ).length;

  const cabangNonaktif = branches.filter(
    (branch) => branch.status === "INACTIVE"
  ).length;
    const summaryCards = [
  { label: "Total Cabang", value: totalCabang, icon: FiBriefcase, accent: "border-blue-300 bg-white text-slate-800" },
  { label: "Cabang Aktif", value: cabangAktif, icon: FiCheckCircle, accent: "border-green-300 bg-white text-slate-800" },
  { label: "Cabang Nonaktif", value: cabangNonaktif, icon: FiXCircle, accent: "border-red-300 bg-white text-slate-800" },
];

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await getBranches();
            // console.warn("🔥 RESPONSE BRANCHES:", data);
            // console.log("RESPONSE BRANCHES:", JSON.stringify(data, null, 2)); 
            setBranches(data.data ?.data ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBranches();
    }, [refreshKey]); 

      const handleDelete = async (id) => {
        notification.confirm("Cabang yang dihapus tidak dapat dipulihkan.", async () => {
          try {
            await deleteBranch(id);
            fetchBranches();
            notification.success("Cabang berhasil dihapus.");
          } catch (err) {
            notification.error(err.message || "Gagal menghapus cabang.");
          }
        }, { actionLabel: "Hapus" });
    };


    // redesain loading dan juga pesan error


    if (loading) return <p>Memuat data cabang...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (branches.length === 0) return <p className="text-slate-500">Belum ada cabang.</p>;


  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {summaryCards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-xl border ${accent} px-4 py-4`}
          >
            <div className="text-left">
              <p className="text-[0.9rem] font-medium text-slate-600">{label}</p>
              <p className="mt-3 text-[2.2rem] font-bold leading-none text-slate-800">{value}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon size={18} />
            </span>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4">
          <h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar Cabang</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-5 py-3">Nama Cabang</th>
                <th className="px-5 py-3">Alamat</th>
                <th className="px-5 py-3">Telepon</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-5 py-4">{branch.name}</td>
                  <td className="px-5 py-4">{branch.address}</td>
                  <td className="px-5 py-4">{branch.phone}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {branch.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        aria-label={`Edit ${branch.name}`}
                        onClick={() => onEdit(branch)}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label={`Hapus ${branch.name}`}
                        onClick={() => handleDelete(branch.id)}
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

export default CabangAdmin;