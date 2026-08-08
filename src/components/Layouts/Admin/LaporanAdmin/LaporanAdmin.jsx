import FilterSection from "../../../fragments/Admin/FilterSection"
import PenjualanPerCabangAdmin from "../../../fragments/Admin/PenjualanPerCabangAdmin"
import ProdukTerLaris from "../../../fragments/Admin/ProdukTerLaris"
import SummaryCard from "../../../fragments/Admin/SummaryCard"
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin"

const LaporanAdmin = ()=>{
    return(
        <>
        <FilterSection />
        <SummaryCard />
        <section className="mt-6 grid grid-cols-2 gap-5">
            <TrenDataAdmin />
            <PenjualanPerCabangAdmin />
        </section>
        
        </>
    )
}

export default LaporanAdmin