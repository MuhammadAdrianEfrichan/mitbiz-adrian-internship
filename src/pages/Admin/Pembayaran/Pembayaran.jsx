import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin"
import PembayaranAdmin from "../../../components/Layouts/Admin/PembayaranAdmin"
import {FiPlus} from "react-icons/fi";
const Pembayaran = ()=>{
    return(
        <SidebarAdmin> 
            <MainAdmin 
                title="Manajemen Metode Pembayaran"
                subtitle="Kelola Metode Pembayaran yang tersedia"
                content={<PembayaranAdmin/>}
                icon = {<FiPlus size={18} />}
                buttonClassName = "inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
                buttonLabel = "Tambah Produk"
            />
        </SidebarAdmin>
    )
}

export default Pembayaran