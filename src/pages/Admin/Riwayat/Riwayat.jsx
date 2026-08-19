import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import RiwayatAdmin from "../../../components/Layouts/Admin/RiwayatAdmin";
const Riwayat = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Riwayat Transaksi"
        subtitle="Lihat seluruh transaksi dan aktivitas pembayaran"
        content={<RiwayatAdmin />}
      />
    </SidebarAdmin>
  );
};

export default Riwayat;