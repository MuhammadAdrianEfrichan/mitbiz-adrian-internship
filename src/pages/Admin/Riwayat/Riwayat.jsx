import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import RiwayatAdmin from "../../../components/Layouts/Admin/RiwayatAdmin";
import { CiExport } from "react-icons/ci";
const Riwayat = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Riwayat Transaksi"
        subtitle="Lihat seluruh transaksi dan aktivitas pembayaran"
        content={<RiwayatAdmin />}
        icon = {<CiExport className="w-7 h-7"/>}
        buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
        buttonLabel="Export CSV"
      />
    </SidebarAdmin>
  );
};

export default Riwayat;