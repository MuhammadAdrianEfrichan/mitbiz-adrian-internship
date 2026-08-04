import MainKasir from "../../../components/fragments/User/MainKasir"
import InputSearch from "../../../components/ui/InputSearch"
import { FiEye } from "react-icons/fi";

const RiwayatTransaksi = ()=>{
    return <MainKasir>
        <div className="bg-white mt-10 w-full h-auto border border-gray-400 rounded-3xl p-10">
            <h3 className="text-black text-xl">Riwayat Transaksi</h3>
            <InputSearch type="text" className=" w-[30%] rounded-xl border border-slate-300 bg-gray-100 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:pl-5 mt-5"placeholder="Cari nomor invoice" />

            <div className="py-10">
                <table className=" w-full text-center">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="py-2">No.Invoice</th>
                            <th>Tanggal</th>
                            <th>Item</th>
                            <th>Subtotal</th>
                            <th>Diskon</th>
                            <th>Pajak</th>
                            <th>Total</th>
                            <th>Pembayaran</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2">INV/2026/02/00010</td>
                            <td>3 Maret 2026</td>
                            <td>2 </td>
                            <td>Rp.91.000</td>
                            <td>-</td>
                            <td>Rp.9.100</td>
                            <td>Rp.100.000</td>
                            <td>Debit Card</td>
                            <td className="flex justify-center mt-2"><FiEye className="w-5 h-5 cursor-pointer"/></td>
                        </tr>
                    </tbody>
                        
                </table>
                </div>
        </div>
        
    </MainKasir>
}

export default RiwayatTransaksi