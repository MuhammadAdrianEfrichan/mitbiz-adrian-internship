import SidebarAdmin from "../../../components/fragments/Admin/SidebarAdmin";
import MainAdmin from "../../../components/fragments/Admin/MainAdmin";
import CabangAdmin from "../../../components/Layouts/Admin/CabangAdmin";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

const Cabang = () => {


  return (
    <SidebarAdmin>
      <MainAdmin
        title="Cabang"
        subtitle="Kelola data cabang dan status operasional"
        content={<CabangAdmin />}
        icon = {<FiPlus size={18} />}
        buttonClassName = "inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#1779dc] cursor-pointer"
        buttonLabel = "Tambah Cabang"
      />
    </SidebarAdmin>
  );
};

export default Cabang;