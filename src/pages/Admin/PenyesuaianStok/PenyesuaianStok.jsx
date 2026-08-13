import { FiPlus, FiUpload } from "react-icons/fi";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import PenyesuaianStokAdmin from "../../../components/Layouts/Admin/PenyesuaianStokAdmin";
import { getProduct } from "../../../services/product.service";
import { getCategory } from "../../../services/category.service";
import { useEffect, useState } from "react";
import { getBranches } from "../../../services/branch.service";
import { createPenstok } from "../../../services/penstok.service";

const initialForm = {
  type: "",
  quantity: "",
  notes: "",
  outletId: "",
  productId: "",
};
const PenyesuaianStok = () => {

    const [showProduct, setShowProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [outlets, setOutlets] = useState([]);
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(true);

const fetchData = async () => {
  setProductLoading(true);
  try {
    const [branchRes, productRes] = await Promise.all([
      getBranches(),
      getProduct(),
    ]);

    const branchList = Array.isArray(branchRes.data?.data)
      ? branchRes.data.data
      : Array.isArray(branchRes.data)
        ? branchRes.data
        : [];

    const productList = Array.isArray(productRes.data?.data)
      ? productRes.data.data
      : Array.isArray(productRes.data)
        ? productRes.data
        : [];

    setOutlets(branchList);
    setProducts(productList);
  } catch (err) {
    console.error("Gagal mengambil data:", err);
    setOutlets([]);
    setProducts([]);
  } finally {
    setProductLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);
    const resetForm = () => {
    setFormData(initialForm);
    setEditingProduct(null);
  };

  const openCreateProduct = () => {
    resetForm();
    setShowProduct(true);
  };

    const openEditProduct = (item) => {
    setEditingProduct(item);
    setFormData({
      type: item.type ?? "",
      quantity: item.quantity ?? "",
      notes: item.notes ?? "",
      outletId: item.outletId ?? "",
      productId: item.productId ?? "",
    });
    setShowProduct(true);
  };

    const handleClose = () => {
    setShowProduct(false);
    resetForm();
  };

  const handleSaveSuccess = () => {
    setShowProduct(false);
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
        const now = new Date();
        const payload = {
          type: formData.type,
          quantity: formData.quantity,
          notes: formData.notes,
          outletId: formData.outletId,
          productId: formData.productId,
          createdAt: now.toISOString()
        };
        console.log(payload);
        if (editingProduct) {
          await createPenstok(payload);
        }
        handleSaveSuccess();
      } catch (err) {
        console.error(err);
        alert("Gagal menyimpan produk");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <SidebarAdmin>
      <div className="relative flex-1">
      <MainAdmin
        title="Penyesuaian Stok"
        subtitle="Tambah atau kurangi stok produk"
        content={<PenyesuaianStokAdmin refreshKey={refreshKey} products={products} outlets={outlets} onEdit={openEditProduct} />}
        icon={<FiPlus size={18} />}
        buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
        buttonLabel="Penyesuaian stok"
        onClick={openCreateProduct}
      />
      {showProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[1px]">
                  <div className="w-full max-w-200 rounded-[18px] border border-gray-400 bg-[#eff4f7] p-6 shadow-2xl">
                    <div className="mb-5">
                      <h2 className="text-[2.1rem] font-bold tracking-tight text-slate-800">Tambah Produk</h2>
                      <p className="mt-1 text-[1.05rem] text-slate-600">Kelola produk Anda</p>
                    </div>
      
                    <form onSubmit={handleSubmit} className="space-y-5">
      
                      <div className="overflow-hidden rounded-[10px] bg-[#edf3f7]">
                        <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                          <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Cabang</div>
                          <select
                            name="outletId"
                            value={formData.outletId}
                            onChange={handleChange}
                            className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 focus:outline-none"
                          >
                            <option value="">Pilih Cabang</option>
                            {outlets.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                        </option>
                                        ))}
                          </select>
                        </div>
      
                        <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                          <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Product</div>
                          <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 focus:outline-none"
                          >
                            <option value="">Pilih Product</option>
                            {products.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                        </option>
                                        ))}
                          </select>
                        </div>
      
                        <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                          <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Tipe Penyesuaian</div>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 focus:outline-none"
                          >
                            <option value="">Pilih Tipe Penyesuaian</option>
                            <option value="IN">Tambah</option>
                            <option value="OUT">Kurangi</option>
                            <option value="CORRECTION">Koreksi</option>
                          </select>
                        </div>
      
                        <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                          <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Jumlah</div>
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                          />
                        </div>

                         <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                          <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Alasan</div>
                          <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Contoh : Restok dari suplier"
                            className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                          />
                        </div>
      
                        
                      </div>
      
                      <div className="flex justify-end gap-3 border-t border-slate-300 pt-4">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-xl bg-[#1c86ef] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1779dc] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmitting ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambah"}
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

export default PenyesuaianStok;