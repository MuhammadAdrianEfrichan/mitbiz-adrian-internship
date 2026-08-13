  import { FiArrowDown, FiArrowUp, FiSearch } from "react-icons/fi";
  import { getPenstok } from "../../../../services/penstok.service";
  import { useEffect, useState } from "react";
  import { formatTanggal } from "../../../../utils/fromatDate";



  const PenyesuaianStokAdmin = ({refreshKey, onEdit, outlets=[], products=[]}) => {

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

      const fetchProduct = async () => {
              setLoading(true);
              try {
                  const data = await getPenstok();
                  // console.warn("🔥 RESPONSE Product:", data);
                  // console.log("RESPONSE Product:", JSON.stringify(data, null, 2)); 
                  setProduct(data.data ??[]);
              } catch (err) {
                  setError(err.message);
                  setProduct([]); 
              } finally {
                  setLoading(false);
              }
          };
          useEffect(() => {
              fetchProduct();
          }, [refreshKey]); 

    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar Produk</h3>
        </div>

        <div className="mb-4 grid grid-cols-[1.5fr_1fr] gap-3">
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
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Cabang</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3">Alasan</th>
                </tr>
              </thead>

              <tbody>
              {loading ? (
    <tr>
      <td colSpan={6} className="p-4 text-center text-sm text-slate-500">
        Memuat data...
      </td>
    </tr>
  ) : product.length === 0 ? (
    <tr>
      <td colSpan={6} className="p-4 text-center text-sm text-slate-500">
        Belum ada data.
      </td>
    </tr>
  ) : (
                product.map((item) => {
                const typeConfig = ADJUSTMENT_TYPE_CONFIG[item.type] ?? DEFAULT_TYPE_CONFIG;
                const Icon = typeConfig.icon;

                return (
                  <tr key={item.id} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 text-slate-700">{formatTanggal(item.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{item.products.name}</td>
                    <td className="px-4 py-3">{item.outlets.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm ${typeConfig.className}`}
                      >
                        <Icon size={12} />
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-600">{item.notes}</td>
                  </tr>
                );
              })
            )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };

  export default PenyesuaianStokAdmin;