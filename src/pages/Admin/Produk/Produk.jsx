import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import ProdukAdmin from "../../../components/Layouts/Admin/ProdukAdmin";
import {FiPlus} from "react-icons/fi";


const Produk = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Manajemen Produk"
        subtitle="Kelola produk Anda"
        content={<ProdukAdmin />}
        icon = {<FiPlus size={18} />}
        buttonClassName = "inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
        buttonLabel = "Tambah Produk"
      />
    </SidebarAdmin>
  );
};

export default Produk;