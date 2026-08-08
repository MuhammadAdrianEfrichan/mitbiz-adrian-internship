import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import ShiftKasirAdmin from "../../../components/Layouts/Admin/ShiftKasirAdmin";

const ShiftKasir = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Manajemen Shift Kasir"
        subtitle="Kelola shift kasir di cabang anda"
        content={<ShiftKasirAdmin />}
      />
    </SidebarAdmin>
  );
};

export default ShiftKasir;