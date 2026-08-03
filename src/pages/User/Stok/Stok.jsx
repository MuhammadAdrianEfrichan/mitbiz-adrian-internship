import { FiDollarSign, FiPercent } from "react-icons/fi"
import Navbar from "../../../components/fragments/User/Navbar/Navbar"
import StatistikCard from "../../../components/fragments/User/StatistikCard"
import Input from "../../../components/ui/Input"
import { PiPackageThin } from 'react-icons/pi';
import { CiSearch } from "react-icons/ci";
import InputSearch from "../../../components/ui/InputSearch";


const Stok = ()=>{
    return (
        <div className=" px-6 min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />
            <div className=" mt-5 grid gap-5 md:grid-cols-3">
                <StatistikCard icon={<PiPackageThin className="text-[1.5rem]" />}>Total Produk</StatistikCard>
                <StatistikCard icon={<FiDollarSign className="text-[1.5rem]" />}>Stok Menipis</StatistikCard>
                <StatistikCard icon={<FiDollarSign className="text-[1.5rem]" />}>Stok Habis</StatistikCard>
            </div>

            <div className="bg-white mt-10 w-full h-auto border border-gray-400 rounded-3xl">
                <h3 className="text-black text-xl p-10">Stok Produk</h3>
                <div className="w-full px-10 grid grid-cols-3 gap-5">
                    
                    <InputSearch type="text" className=" w-full rounded-xl border border-slate-300 bg-gray-100 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:pl-5"placeholder="Cari Produk atau SKU..." icon={<CiSearch className="w-5 h-5" />}/>

                    <select className="w-full rounded-xl border border-slate-300 bg-gray-200 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="">Semua kategori</option>
                            <option value="toko">Toko</option>
                            <option value="restoran">Restoran</option>
                            <option value="kafe">Kafe</option>
                            <option value="laundry">Laundry</option>
                        </select>
                    <select className="w-full rounded-xl border border-slate-300 bg-gray-200 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="">Semua stok</option>
                            <option value="toko">Toko</option>
                            <option value="restoran">Restoran</option>
                            <option value="kafe">Kafe</option>
                            <option value="laundry">Laundry</option>
                        </select>
                </div>
                <div className="p-10">
                <table className=" w-full text-center">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="py-2">SKU</th>
                            <th>Produk</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Min.Stok</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2">001</td>
                            <td>nasi goreng</td>
                            <td>makanan</td>
                            <td>Rp.10.0000</td>
                            <td>6</td>
                            <td>10</td>
                            <td>tersedia</td>
                        </tr>
                    </tbody>
                        
                </table>
                </div>
            </div>
        </div>
    )
}

export default Stok