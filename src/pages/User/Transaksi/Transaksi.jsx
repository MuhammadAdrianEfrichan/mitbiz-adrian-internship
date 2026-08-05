import ButtonLogin from "../../../components/fragments/ButtonLogin";
import Navbar from "../../../components/fragments/User/Navbar"
import InputSearch from "../../../components/ui/InputSearch"
import { BiDetail } from "react-icons/bi";
import { PiBasket } from "react-icons/pi";
const Transaksi = ()=>{
    return(
        <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />
            <div className="flex gap-8 px-6 pb-10 pt-24">
                <div className="mt-10 flex justify-between w-[70%] h-500">
                <h3 className="text-black text-2xl font-bold"> Pilih Produk</h3>
                <InputSearch type="text" className=" w-100 rounded-xl border border-slate-300 bg-gray-100 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:pl-5"placeholder="Cari Produk atau SKU..."/>
            </div>
            <div className="w-[30%] border border-gray-400 mt-10 h-180 rounded-2xl fixed right-0">
                <div className="flex text-2xl gap-5 font-bold py-5 px-10 border-b border-gray-300 ">
                    <BiDetail className="w-8 h-8"/>
                <h3> Detail Transaksi (0)</h3>
                </div>
                <div className="flex flex-col gap-5 py-20 justify-center items-center text-gray-600">
                    <PiBasket className="w-10 h-10" />
                    <h3 className="text-xl ">Keranjang Kosong</h3>
                </div>
                <div className="border flex flex-col gap-5 p-5
                mx-5 rounded-xl">
                    <div className="flex justify-between">
                        <span>Sub Total</span>
                        <span>Rp.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Pajak 12%</span>
                        <span>Rp.0</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-2xl py-3" >
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

    )
}

export default Transaksi