import MainAdmin from "../../../components/fragments/Admin/MainAdmin"
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin"
import LaporanAdmin from "../../../components/Layouts/Admin/LaporanAdmin/LaporanAdmin"
import { CiExport } from "react-icons/ci";
const Laporan = ()=>{
    return (
        <SidebarAdmin>
            <MainAdmin 
            title='Laporan'
            subtitle = 'Analisis dan penjualan lengkap'
            content = {<LaporanAdmin />}
            icon = {<CiExport className="w-7 h-7"/>}
            buttonLabel = "Export Laporan"
            buttonClassName = "flex gap-2 text-xl bg-blue-600 p-3 text-white rounded-xl cursor-pointer"
        />
        </SidebarAdmin>
    )
}

export default Laporan