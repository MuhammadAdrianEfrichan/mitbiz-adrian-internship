import MainAdmin from "../../../components/fragments/Admin/MainAdmin"
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin"
import StokAdmin from "../../../components/Layouts/Admin/StokAdmin"

const AdminStok = ()=>{
    return (
    <SidebarAdmin>
      <MainAdmin
        title="Manajemen Inventori"
        subtitle="Monitor dan kelola stok produk percabang"
        content={<StokAdmin />}
      />
    </SidebarAdmin>
    )
}

export default AdminStok