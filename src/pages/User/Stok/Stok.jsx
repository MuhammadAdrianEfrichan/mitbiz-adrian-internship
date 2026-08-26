import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiBox, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import MainKasir from "../../../components/fragments/User/MainKasir";
import { getProduct } from "../../../services/Admin/product.service";
import { getStocks } from "../../../services/User/stock.service";

const getList = (response) => (
  Array.isArray(response?.data?.data) ? response.data.data : Array.isArray(response?.data) ? response.data : []
);

const Stok = () => {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [stockResponse, productResponse] = await Promise.all([getStocks(), getProduct()]);
        setStocks(getList(stockResponse));
        setProducts(getList(productResponse));
      } catch (requestError) {
        setError(requestError.message || "Gagal mengambil data stok.");
        setStocks([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSearchParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const categories = useMemo(() => {
    const unique = new Map();
    stocks.forEach((stock) => {
      const category = stock.product?.category;
      if (category?.id) unique.set(category.id, category.name);
    });
    return Array.from(unique, ([id, name]) => ({ id, name }));
  }, [stocks]);

  const stockRows = useMemo(() => {
    const productById = new Map(products.map((product) => [product.id, product]));
    const categoryId = searchParams.get("categoryId") || "";
    const selectedStatus = searchParams.get("status") || "";
    const keyword = (searchParams.get("search") || "").trim().toLowerCase();

    return stocks.map((stock) => {
      const product = { ...productById.get(stock.productId), ...stock.product };
      const quantity = stock.isUnlimited ? null : Number(stock.quantity ?? 0);
      const minStok = Number(product.minStock ?? 10);
      const status = stock.isUnlimited ? "Tersedia" : quantity === 0 ? "Habis" : quantity <= minStok ? "Menipis" : "Normal";
      return { ...stock, product, quantity, minStok, status };
    }).filter((row) => {
      if (categoryId && row.product.category?.id !== categoryId) return false;
      if (selectedStatus && row.status !== selectedStatus) return false;
      if (!keyword) return true;
      return [row.product.sku, row.product.name, row.product.category?.name, row.outlet?.name, row.status, row.quantity, row.minStok].join(" ").toLowerCase().includes(keyword);
    });
  }, [products, stocks, searchParams]);

  const summaryCards = [
    { label: "Total Produk", value: stocks.length, icon: FiBox },
    { label: "Stok Menipis", value: stockRows.filter((row) => row.status === "Menipis").length, icon: FiAlertTriangle },
    { label: "Stok Habis", value: stockRows.filter((row) => row.status === "Habis").length, icon: FiAlertTriangle },
  ];

  const statusBadgeClass = (status) => {
    if (status === "Habis") return "bg-red-100 text-red-700";
    if (status === "Menipis") return "bg-amber-100 text-amber-700";
    if (status === "Tersedia") return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <MainKasir>
      <div className="space-y-5">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summaryCards.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between"><span className="text-[0.92rem] font-medium text-slate-600">{label}</span><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500"><Icon size={16} /></span></div>
              <div className="text-[2rem] font-semibold leading-none text-slate-800">{value}</div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-[1.1rem] font-semibold text-slate-700">Stok Produk</h3>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1.5fr_1fr_1fr]">
            <label className="relative block"><span className="sr-only">Cari produk atau SKU</span><FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" size={15} /><input type="search" placeholder="Cari produk atau SKU..." className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500" value={searchParams.get("search") || ""} onChange={(event) => updateSearchParam("search", event.target.value)} /></label>
            <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500" value={searchParams.get("categoryId") || ""} onChange={(event) => updateSearchParam("categoryId", event.target.value)}><option value="">Semua kategori</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
            <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500" value={searchParams.get("status") || ""} onChange={(event) => updateSearchParam("status", event.target.value)}><option value="">Semua stok</option><option value="Normal">Normal</option><option value="Menipis">Menipis</option><option value="Habis">Habis</option><option value="Tersedia">Tersedia</option></select>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200"><div className="overflow-x-auto"><table className="min-w-3xl w-full border-collapse text-left text-sm text-slate-700"><thead><tr className="bg-slate-100 text-sm font-semibold text-slate-700"><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Stok</th><th className="px-4 py-3">Min. Stok</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{loading ? <tr><td colSpan={7} className="p-4 text-center text-slate-500">Memuat data...</td></tr> : error ? <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr> : stockRows.length === 0 ? <tr><td colSpan={7} className="p-4 text-center text-slate-500">Belum ada data stok.</td></tr> : stockRows.map((row) => <tr key={row.id} className="border-t border-slate-200"><td className="px-4 py-3">{row.product.sku ?? "-"}</td><td className="px-4 py-3 font-medium">{row.product.name ?? "-"}</td><td className="px-4 py-3">{row.product.category?.name ?? "-"}</td><td className="px-4 py-3">{row.product.price == null ? "-" : `Rp ${Number(row.product.price).toLocaleString("id-ID")}`}</td><td className="px-4 py-3">{row.isUnlimited ? "Unlimited" : row.quantity}</td><td className="px-4 py-3">{row.minStok}</td><td className="px-4 py-3"><span className={`inline-flex rounded-md px-3 py-1.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>{row.status}</span></td></tr>)}</tbody></table></div></div>
        </section>
      </div>
    </MainKasir>
  );
};

export default Stok;