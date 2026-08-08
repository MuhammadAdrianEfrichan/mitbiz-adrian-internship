import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import KasirAdmin from "../../../components/Layouts/Admin/KasirAdmin";

const Kasir = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Manajemen Kasir"
        subtitle="Kelola data kasir dan akses mereka"
        content={<KasirAdmin />}
      />
    </SidebarAdmin>
  );
};

export default Kasir;