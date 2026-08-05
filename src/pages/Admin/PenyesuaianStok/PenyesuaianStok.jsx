import { FiPlus } from "react-icons/fi";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import PenyesuaianStokAdmin from "../../../components/Layouts/Admin/PenyesuaianStokAdmin";

const PenyesuaianStok = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Penyesuaian Stok"
        subtitle="Tambah atau kurangi stok produk"
        content={<PenyesuaianStokAdmin />}
        icon={<FiPlus size={18} />}
        buttonClassName="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
        buttonLabel="Penyesuaian stok"
      />
    </SidebarAdmin>
  );
};

export default PenyesuaianStok;