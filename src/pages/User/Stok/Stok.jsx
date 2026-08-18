import  MainKasir  from "../../../components/fragments/User/MainKasir"
import { useEffect, useState, useMemo } from "react";
import { FiBox, FiSearch, FiAlertTriangle, FiPackage } from "react-icons/fi";
import { getPenstok } from "../../../services/penstok.service";
import { getProduct } from "../../../services/product.service";
import { formatTanggal } from "../../../utils/fromatDate";
import { useSearchParams } from "react-router-dom";
import { getMe, login } from "../../../services/auth.service";
const Stok = ()=>{
    const [penStok, setPenStok] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [outletId, setOutletId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [profileRes, productRes, penStokRes] = await Promise.all([
            getMe(),
            getProduct(),
            getPenstok(),
        ]);

        const currentOutletId = profileRes.data?.outletId ?? profileRes.data?.outlet?.id ?? null;
        setOutletId(currentOutletId);

        const productList = Array.isArray(productRes.data?.data)
            ? productRes.data.data
            : Array.isArray(productRes.data)
            ? productRes.data
            : [];

        const penStokList = Array.isArray(penStokRes.data?.data)
            ? penStokRes.data.data
            : Array.isArray(penStokRes.data)
            ? penStokRes.data
            : [];

        setProducts(productList);
        setPenStok(penStokList);
    } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError(err.message);
        setProducts([]);
        setPenStok([]);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchData();
  }, []);

  // handleSearch & updateSearchParam ada di scope komponen (bukan di dalam useMemo)
  // supaya bisa dipakai dari JSX.
  const updateSearchParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const handleSearch = (value) => updateSearchParam("search", value);

  // Ambil daftar kategori unik dari produk (untuk dropdown "Semua kategori")
  const categories = useMemo(() => {
    const unique = new Map();
    products.forEach((product) => {
      if (product.category?.id) {
        unique.set(product.category.id, product.category.name);
      }
    });
    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [products]);

const stockRows = useMemo(() => {
    const rows = [];

    const selectedCategoryId = searchParams.get("categoryId") || "";
    const selectedStatus = searchParams.get("status") || "";
    const keyword = (searchParams.get("search") || "").trim().toLowerCase();

    if (!outletId) return rows; 

    products.forEach((product) => {
        if (selectedCategoryId && product.category?.id !== selectedCategoryId) return;

        const history = penStok.filter(
            (item) => item.productId === product.id && item.outletId === outletId
        );

        if (history.length === 0) return;

        const stokTersedia = history.reduce((total, item) => {
            if (item.type === "IN") return total + item.quantity;
            if (item.type === "OUT") return total - item.quantity;
            if (item.type === "CORRECTION") return item.quantity;
            return total;
        }, 0);

        const lastUpdate = history.reduce(
            (latest, item) =>
                new Date(item.createdAt) > new Date(latest) ? item.createdAt : latest,
            history[0].createdAt
        );

        const minStok = product.minStock ?? 10;
        const status =
            stokTersedia === 0 ? "Habis" : stokTersedia <= minStok ? "Menipis" : "Normal";

        if (selectedStatus && status !== selectedStatus) return;

        const row = {
            id: `${product.id}-${outletId}`,
            nama: product.name,
            kategori: product.category?.name ?? "-",
            stokTersedia,
            minStok,
            status,
            tanggal: lastUpdate,
        };

        if (keyword) {
            const searchable = [
                row.nama,
                row.kategori,
                row.status,
                String(row.stokTersedia),
                String(row.minStok),
            ]
                .join(" ")
                .toLowerCase();

            if (!searchable.includes(keyword)) return;
        }

        rows.push(row);
    });

    return rows;
}, [products, penStok, searchParams, outletId]);

  const summaryCards = useMemo(
    () => [
      { label: "Total Produk", value: products.length, icon: FiBox },
      {
        label: "Stok Menipis",
        value: stockRows.filter((r) => r.status === "Menipis").length,
        icon: FiAlertTriangle,
      },
      {
        label: "Stok Habis",
        value: stockRows.filter((r) => r.status === "Habis").length,
        icon: FiPackage,
      },
    ],
    [products, stockRows]
  );

  const statusBadgeClass = (status) => {
    if (status === "Habis") return "bg-red-100 text-red-700";
    if (status === "Menipis") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };
    return (
        <MainKasir>
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
                          value={searchParams.get("search") || ""}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </label>
            
            
                      <select
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                        value={searchParams.get("categoryId") || ""}
                        onChange={(e) => updateSearchParam("categoryId", e.target.value)}
                      >
                        <option value="">Semua kategori</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
            
                      <select
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                        value={searchParams.get("status") || ""}
                        onChange={(e) => updateSearchParam("status", e.target.value)}
                      >
                        <option value="">Semua status</option>
                        <option value="Normal">Normal</option>
                        <option value="Menipis">Menipis</option>
                        <option value="Habis">Habis</option>
                      </select>
                    </div>
            
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                          <thead>
                            <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                              <th className="px-4 py-3">Produk</th>
                              <th className="px-4 py-3">Kategori</th>
                              <th className="px-4 py-3">Stok Tersedia</th>
                              <th className="px-4 py-3">Min. Stok</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Terakhir Update</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={7} className="p-4 text-center text-sm text-slate-500">
                                  Memuat data...
                                </td>
                              </tr>
                            ) : error ? (
                              <tr>
                                <td colSpan={7} className="p-4 text-center text-sm text-red-500">
                                  {error}
                                </td>
                              </tr>
                            ) : stockRows.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-4 text-center text-sm text-slate-500">
                                  Belum ada data stok.
                                </td>
                              </tr>
                            ) : (
                              stockRows.map((row) => (
                                <tr key={row.id} className="border-t border-slate-200 bg-white">
                                  <td className="px-4 py-3 font-medium text-slate-700">{row.nama}</td>
                                  <td className="px-4 py-3">{row.kategori}</td>
                                  <td className="px-4 py-3">{row.stokTersedia}</td>
                                  <td className="px-4 py-3">{row.minStok}</td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-flex rounded-md px-3 py-1.5 text-xs font-medium ${statusBadgeClass(
                                        row.status
                                      )}`}
                                    >
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
        </MainKasir>
        
    )
}

export default Stok