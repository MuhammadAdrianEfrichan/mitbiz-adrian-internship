import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import KategoriAdmin from "../../../components/Layouts/Admin/KategoriAdmin";
import {FiPlus} from "react-icons/fi";

const Kategori = () => {
  return (
    <SidebarAdmin>
      <MainAdmin
        title="Manajement Kategori"
        subtitle="Kelola kategori produk"
        content={<KategoriAdmin />}
          icon = {<FiPlus size={18} />}
                buttonClassName = "inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
                buttonLabel = "Tambah Produk"
      />
    </SidebarAdmin>
  );
};

export default Kategori;