import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import PengaturanAdmin from "../../../components/Layouts/Admin/PengaturanAdmin";

const Pengaturan = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Pengaturan"
        subtitle="Kelola data bisnis dan kebijakan diskon & pajak"
        content={<PengaturanAdmin />}
      />
    </SidebarAdmin>
  );
};

export default Pengaturan;