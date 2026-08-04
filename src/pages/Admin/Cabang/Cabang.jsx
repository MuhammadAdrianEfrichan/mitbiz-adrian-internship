import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import CabangAdmin from "../../../components/Layouts/Admin/CabangAdmin";

const Cabang = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Cabang"
        subtitle="Kelola data cabang dan status operasional"
        content={<CabangAdmin />}
      />
    </SidebarAdmin>
  );
};

export default Cabang;