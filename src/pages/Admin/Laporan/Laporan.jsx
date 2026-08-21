import MainAdmin from "../../../components/fragments/Admin/MainAdmin"
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin"
import LaporanAdmin from "../../../components/Layouts/Admin/LaporanAdmin/LaporanAdmin"
import { CiExport } from "react-icons/ci";
const Laporan = ()=>{
    return (
        <SidebarAdmin>
            <MainAdmin 
            content = {<LaporanAdmin />}
        />
        </SidebarAdmin>
    )
}

export default Laporan