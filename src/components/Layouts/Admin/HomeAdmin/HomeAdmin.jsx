import { useEffect, useState } from "react"
import PenjualanPerCabangAdmin from "../../../fragments/Admin/PenjualanPerCabangAdmin"
import PenjualanPerPembayaran from "../../../fragments/Admin/PenjualanPerPembayaran"
import ProdukTerLaris from "../../../fragments/Admin/ProdukTerLaris"
import SummaryCard from "../../../fragments/Admin/SummaryCard"
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin"
import { getDasboard } from "../../../../services/Admin/dasboard.service" // sesuaikan path/nama service-nya

const HomeAdmin = () => {
    const [summary, setSummary] = useState(null)
    const [trend, setTrend] = useState([])
    const [byBranch, setByBranch] = useState([])
    const [byPaymentMethod, setByPaymentMethod] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await getDasboard()
                const data = res?.data?.data ?? res?.data ?? {}

                setSummary(data.summary ?? null)
                setTrend(data.trend ?? [])
                setByBranch(data.perOutlet ?? [])
                setByPaymentMethod(data.perPayment ?? [])
                setProducts(data.topProducts ?? [])
                console.log("Sample topProducts:", JSON.stringify(data.topProducts, null, 2))

            } catch (err) {
                setError(err.message || "Gagal mengambil data dashboard")
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])
    
    return (
        <>
            {loading && <p className="mb-4 text-sm text-slate-500">Memuat dashboard...</p>}
            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <SummaryCard summary={summary} />
            <TrenDataAdmin data={trend} />
            <section className="mt-6 grid grid-cols-2 gap-5">
                <PenjualanPerCabangAdmin data={byBranch} />
                <PenjualanPerPembayaran data={byPaymentMethod} />
            </section>
            <ProdukTerLaris products={products} />
        </>
    )
}

export default HomeAdmin