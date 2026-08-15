import { useEffect, useState, useMemo } from "react";
import { FiBox, FiSearch, FiAlertTriangle, FiPackage } from "react-icons/fi";
import { getPenstok } from "../../../../services/penstok.service";
import { getBranches } from "../../../../services/branch.service";
import { getProduct } from "../../../../services/product.service";
import { formatTanggal } from "../../../../utils/fromatDate";

const StokAdmin = () => {
  const [penStok, setPenStok] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [branchRes, productRes, penStokRes] = await Promise.all([
        getBranches(),
        getProduct(),
        getPenstok(),
      ]);

      const branchList = Array.isArray(branchRes.data?.data) ? branchRes.data.data : Array.isArray(branchRes.data) ? branchRes.data : [];
      const productList = Array.isArray(productRes.data?.data) ? productRes.data.data : Array.isArray(productRes.data) ? productRes.data : [];
      const penStokList = Array.isArray(penStokRes.data?.data) ? penStokRes.data.data : Array.isArray(penStokRes.data) ? penStokRes.data : [];

      setOutlets(branchList);
      setProducts(productList);
      setPenStok(penStokList); 
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(err.message);
      setOutlets([]);
      setProducts([]);
      setPenStok([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stockRows = useMemo(() => {
    const rows = [];

    products.forEach((product) => {
      outlets.forEach((outlet) => {
        const history = penStok.filter(
          (item) => item.productId === product.id && item.outletId === outlet.id
        );

        if (history.length === 0) return; 

        const stokTersedia = history.reduce((total, item) => {
          if (item.type === "IN") return total + item.quantity;
          if (item.type === "OUT") return total - item.quantity;
          if (item.type === "CORRECTION") return item.quantity;
          return total;
        }, 0);

        const lastUpdate = history.reduce(
          (latest, item) => (new Date(item.createdAt) > new Date(latest) ? item.createdAt : latest),
          history[0].createdAt
        );

        const minStok = product.minStock ?? 10;

        rows.push({
          id: `${product.id}-${outlet.id}`,
          nama: product.name,
          kategori: product.category?.name ?? "-",
          cabang: outlet.name,
          stokTersedia,
          minStok,
          status: stokTersedia === 0 ? "Habis" : stokTersedia <= minStok ? "Menipis" : "Normal",
          tanggal: lastUpdate,
        });
      });
    });

    return rows;
  }, [products, outlets, penStok]);

  const summaryCards = useMemo(
    () => [
      { label: "Total Produk", value: products.length, icon: FiBox },
      { label: "Stok Menipis", value: stockRows.filter((r) => r.status === "Menipis").length, icon: FiAlertTriangle },
      { label: "Stok Habis", value: stockRows.filter((r) => r.status === "Habis").length, icon: FiPackage },
    ],
    [products, stockRows]
  );

  const statusBadgeClass = (status) => {
    if (status === "Habis") return "bg-red-100 text-red-700";
    if (status === "Menipis") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.92rem] font-medium text-slate-600">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                <Icon size={16} />
              </span>
            </div>
            <div className="text-[2rem] font-semibold leading-none text-slate-800">{value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[1.1rem] font-semibold text-slate-700">Daftar Stok</h3>
        </div>

        <div className="mb-4 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3">
          <label className="relative block">
            <span className="sr-only">Cari produk</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Semua cabang</option>
          </select>

          <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Semua kategori</option>
          </select>

          <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Semua status</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Cabang</th>
                  <th className="px-4 py-3">Stok Tersedia</th>
                  <th className="px-4 py-3">Min. Stok</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Terakhir Update</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-sm text-slate-500">Memuat data...</td>
                  </tr>
                ) : stockRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-sm text-slate-500">Belum ada data stok.</td>
                  </tr>
                ) : (
                  stockRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200 bg-white">
                      <td className="px-4 py-3 font-medium text-slate-700">{row.nama}</td>
                      <td className="px-4 py-3">{row.kategori}</td>
                      <td className="px-4 py-3">{row.cabang}</td>
                      <td className="px-4 py-3">{row.stokTersedia}</td>
                      <td className="px-4 py-3">{row.minStok}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-3 py-1.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatTanggal(row.tanggal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StokAdmin;