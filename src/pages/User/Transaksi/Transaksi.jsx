import ButtonLogin from "../../../components/fragments/ButtonLogin";
import Navbar from "../../../components/fragments/User/Navbar";
import InputSearch from "../../../components/ui/InputSearch";
import ProductCard from "../../../components/fragments/User/ProductCard/ProductCard";
import { BiDetail } from "react-icons/bi";
import { PiBasket } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProduct } from "../../../services/product.service";



const Transaksi = (refreshKey) => {
    const [product, setProduct] = useState([]);
    const [totalProduct, setTotalProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ searchParams, setSearchParams] = useSearchParams();


    const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProduct();
                console.warn("🔥 RESPONSE Product:", data);
                console.log("RESPONSE Product:", JSON.stringify(data, null, 2)); 
                setProduct(data.data ??[]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
    };
    useEffect(() => {
        fetchProduct();
    }, [refreshKey]); 


    return (
        <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />
            <div className="flex gap-8 px-6 pb-10 pt-24">
                <div className="mt-10 w-[70%]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-black text-2xl font-bold">Pilih Produk</h3>
                            <div className="text-sm text-gray-500 mt-1">Pilih produk yang ingin ditambahkan ke transaksi</div>
                        </div>
                        <InputSearch
                            type="text"
                            className="w-100 rounded-xl border border-slate-300 bg-gray-100 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:pl-5"
                            placeholder="Cari Produk atau SKU..."
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 mb-6">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium shadow">Semua <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">{product.length}</span></button>
                        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm">Makanan <span className="ml-2 text-gray-500">13</span></button>
                        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm">Minuman <span className="ml-2 text-gray-500">4</span></button>
                        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm">Snack <span className="ml-2 text-gray-500">8</span></button>
                        <button className="px-4 py-2 bg-gray-100 rounded-full text-sm">Alat Tulis <span className="ml-2 text-gray-500">12</span></button>
                    </div>

                    {/* Product grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {product.map((p) => (
                            <ProductCard key={p.id} image={p.imageUrl} title={p.name} sku={p.sku} price={p.price} />
                        ))}
                    </div>
                </div>

                {/* Sidebar / Detail Transaksi */}
                <div className="w-[30%] border border-gray-400 mt-10 h-180 rounded-2xl fixed right-0 bg-white">
                    <div className="flex text-2xl gap-5 font-bold py-5 px-10 border-b border-gray-300 ">
                        <BiDetail className="w-8 h-8" />
                        <h3> Detail Transaksi (0)</h3>
                    </div>
                    <div className="flex flex-col gap-5 py-20 justify-center items-center text-gray-600">
                        <PiBasket className="w-10 h-10" />
                        <h3 className="text-xl ">Keranjang Kosong</h3>
                    </div>
                    <div className="border flex flex-col gap-5 p-5 mx-5 rounded-xl">
                        <div className="flex justify-between">
                            <span>Sub Total</span>
                            <span>Rp.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pajak 12%</span>
                            <span>Rp.0</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold text-2xl py-3">
                            <span>Total</span>
                            <span>Rp.0</span>
                        </div>
                    </div>
                    <div className="mx-5 mt-5">
                        <ButtonLogin type="">Proses Pembayaran</ButtonLogin>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transaksi;