import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import ProdukAdmin from "../../../components/Layouts/Admin/ProdukAdmin";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { createProduct, getProduct, updateProduct } from "../../../services/product.service";
import { getCategory } from "../../../services/category.service";

const initialForm = {
  name: "",
  price: "",
  description: "",
  discount: "",
  imageUrl: "",
  sku: "",
  categoryId: "",
};

const Produk = () => {
  const [showProduct, setShowProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [product, setProduct] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const data = await getCategory();
      const productList = Array.isArray(data.data?.data)
        ? data.data.data
        : Array.isArray(data.data)
          ? data.data
          : [];
      setProduct(productList);
    } catch (err) {
      console.error("Gagal mengambil daftar produk:", err);
      setProduct([]);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingProduct(null);
  };

  const openCreateProduct = () => {
    resetForm();
    setShowProduct(true);
    setImageFile(null);
  };

  const openEditProduct = (item) => {
    setEditingProduct(item);
    setFormData({
      name: item.name ?? "",
      price: item.price ?? "",
      description: item.description ?? "",
      discount: item.discount ?? "",
      imageUrl: item.imageUrl ?? "",
      sku: item.sku ?? "",
      categoryId: item.categoryId ?? "",
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
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("description", formData.description);
    payload.append("discount", formData.discount);
    payload.append("sku", formData.sku);
    payload.append("categoryId", formData.categoryId);

    if (imageFile) {
      payload.append("image", imageFile);
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await createProduct(payload);
    }

    handleSaveSuccess();
  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan produk");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  console.log("File dipilih:", file);
  if (file) {
    setImageFile(file);
  }
};

  return (
    <SidebarAdmin>
      <div className="relative flex-1">
        <MainAdmin
          title="Manajemen Produk"
          subtitle="Kelola produk Anda"
          content={<ProdukAdmin refreshKey={refreshKey} category={product} onEdit={openEditProduct} />}
          icon={<FiPlus size={18} />}
          buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
          buttonLabel="Tambah Produk"
          onClick={openCreateProduct}
        />

        {showProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-[1px]">
            <div className="w-full max-w-300 rounded-[18px] border border-gray-400 bg-[#eff4f7] p-6 shadow-2xl">
              <div className="mb-5">
                <h2 className="text-[2.1rem] font-bold tracking-tight text-slate-800">Tambah Produk</h2>
                <p className="mt-1 text-[1.05rem] text-slate-600">Kelola produk Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-[14px] bg-[#edf3f7] p-4">
                  <div className="flex h-55 items-center justify-center rounded-[10px] border-2 border-dashed border-slate-300 bg-[#edf3f7]">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <FiUpload size={35} className="mb-3" />
                      <p className="text-sm text-slate-500">Max 10MB, PNG, JPEG</p>
                      <input 
                        type="file"
                        name="imageUrl"
                        className="mt-4 rounded-md border border-slate-300 bg-gray-300 px-5 py-2 text-sm font-medium text-slate-600 shadow-sm "
                        onChange={handleImageChange}
                     />
                        
                        
                      
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[10px] bg-[#edf3f7]">
                  <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                    <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Nama Produk</div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nama Produk"
                      className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                    <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">SKU</div>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Kode SKU"
                      className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                    <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Harga</div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                    <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Diskon (%)</div>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                    <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Masukkan 0 jika produk tidak ada diskon</div>
                    <div className="px-4 py-3 text-slate-500"> </div>
                  </div>

                  <div className="grid grid-cols-[160px_minmax(0,1fr)] border-b border-gray-400 bg-[#eff4f7]">
                    <div className="flex items-center px-4 py-3 text-base font-medium text-slate-700">Kategori</div>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full border-0 bg-transparent px-4 py-3 text-base text-slate-700 focus:outline-none"
                    >
                      <option value="">Pilih Kategori</option>
                      {product.map((branch) => (
                                  <option key={branch.id} value={branch.id}>
                                  {branch.name}
                                  </option>
                                  ))}
                    </select>
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

export default Produk;