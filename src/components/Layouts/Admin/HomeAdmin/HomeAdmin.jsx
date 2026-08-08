import PenjualanPerCabangAdmin from "../../../fragments/Admin/PenjualanPerCabangAdmin"
import PenjualanPerPembayaran from "../../../fragments/Admin/PenjualanPerPembayaran"
import ProdukTerLaris from "../../../fragments/Admin/ProdukTerLaris"
import SummaryCard from "../../../fragments/Admin/SummaryCard"
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin"

const HomeAdmin = ()=>{
    return(
        <>
         <SummaryCard />
        <TrenDataAdmin />
        <section className="mt-6 grid grid-cols-2 gap-5">
            <PenjualanPerCabangAdmin />
            <PenjualanPerPembayaran />
        </section>
        <ProdukTerLaris />
        </>
    )
}

export default HomeAdmin