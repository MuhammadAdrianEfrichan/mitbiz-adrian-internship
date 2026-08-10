import { useEffect, useState } from "react";
import { FiEdit2, FiPackage, FiSearch, FiTrash2 } from "react-icons/fi";
import { deleteProduct, getProduct } from "../../../../services/product.service";



const ProdukAdmin = ({refreshKey, onEdit, category=[]}) => {

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async () => {



          setLoading(true);
          try {
              const data = await getProduct();
              // console.warn("🔥 RESPONSE Product:", data);
              console.log("RESPONSE Product:", JSON.stringify(data, null, 2)); 
              setProduct(data.data ?? []);
          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };
      useEffect(() => {
          fetchProduct();
      }, [refreshKey]); 

      const handleDelete = async (id) => {
              if (!confirm("Yakin ingin menghapus cabang ini?")) return;
              try {
                  await deleteProduct(id);
                  fetchProduct();
              } catch (err) {
                  alert(err.message);
              }
          };

    if (loading) return <p>Memuat data cabang...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (product.length === 0) return <p className="text-slate-500">Belum product.</p>;
  

  return (
    <div className="space-y-6">

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Total Produk</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FiPackage size={16} />
            </span>
          </div>
          <div className="text-[2.2rem] font-bold leading-none text-slate-800">{product.length}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Produk Aktif</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FiPackage size={16} />
            </span>
          </div>
          <div className="text-[2.2rem] font-bold leading-none text-slate-800">5</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4">
          <h3 className="text-[1.08rem] font-semibold text-slate-700">Daftar Produk</h3>
        </div>

        <div className="flex items-center gap-3 px-5 pb-4">
          <label className="relative block w-full">
            <span className="sr-only">Cari produk</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <FiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari kasir berdasarkan nama atau username..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <select
            className="min-w-45
            rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Semua kategori</option>
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Nama Produk</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Harga</th>
                <th className="px-5 py-3">Diskon</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {product.map((item) => (
                <tr key={item.id} className="border-t border-slate-200 text-sm text-slate-700">
                  <td className="px-5 py-4">{item.sku}</td>
                  <td className="px-5 py-4">{item.name}</td>
                  <td className="px-5 py-4">{item.category.name}</td>
                  <td className="px-5 py-4">
                    <div>
                      {item.price !== "-" && (
                        <p className="text-xs text-slate-400 line-through">{item.price}</p>
                      )}
                      <p className="font-medium text-slate-700">Rp.{item.price - (item.price * item.discount / 100)}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {item.discount === "-" ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <span className="inline-flex rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                        {item.discount}%
                      </span>
                    )}
                  </td>
                
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        aria-label={`Edit ${item.id}`}
                        onClick={() => onEdit(product)}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        aria-label={`Hapus ${item.id}`}
                        onClick={() => handleDelete(item.id)}
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

export default ProdukAdmin;