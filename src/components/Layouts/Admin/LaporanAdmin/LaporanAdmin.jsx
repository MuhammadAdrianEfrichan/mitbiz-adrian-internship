import { useEffect, useState } from "react"
import { FiDownload } from "react-icons/fi"
import FilterSection from "../../../fragments/Admin/FilterSection"
import PenjualanPerCabangAdmin from "../../../fragments/Admin/PenjualanPerCabangAdmin"
import ProdukTerLaris from "../../../fragments/Admin/ProdukTerLaris"
import SummaryCard from "../../../fragments/Admin/SummaryCard"
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin"
import { getBranches } from "../../../../services/branch.service"
import {
    downloadSalesReport,
    getProductsReport,
    getStocksReport,
} from "../../../../services/laporan.service"

const getReportList = (response) => {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.data?.data)) return response.data.data
    if (Array.isArray(response?.results)) return response.results
    return []
}

const PERIOD_OPTIONS = [
    { value: "7d", label: "7 Hari Terakhir" },
    { value: "30d", label: "30 Hari Terakhir" },
    { value: "90d", label: "90 Hari Terakhir" },
]

const LaporanAdmin = () => {
    const [reportData, setReportData] = useState({ products: [], stocks: [] })
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [filters, setFilters] = useState({
        period: "30d",
        outletId: "",
        category: "",
    })

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await getBranches()
                setBranches(getReportList(res))
            } catch (err) {
                console.error("Gagal mengambil daftar cabang:", err)
            }
        }
        fetchBranches()
    }, [])

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true)
            setError("")
            try {
                const params = {
                    period: filters.period,
                    outletId: filters.outletId || undefined,
                    category: filters.category || undefined,
                }

                const [productsResult, stocksResult] = await Promise.allSettled([
                    getProductsReport(params),
                    getStocksReport(params),
                ])

                const products = productsResult.status === "fulfilled" ? productsResult.value : []
                const stocks = stocksResult.status === "fulfilled" ? stocksResult.value : []

                setReportData({
                    products: getReportList(products),
                    stocks: getReportList(stocks),
                })

                const failedReports = [productsResult, stocksResult].filter((result) => result.status === "rejected")
                if (failedReports.length === 2) {
                    throw failedReports[0].reason
                }
            } catch (err) {
                setError(err.message || "Gagal mengambil data laporan")
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [filters])

    const handleExport = async () => {
        try {
            const file = await downloadSalesReport({
                period: filters.period,
                outletId: filters.outletId || undefined,
            })
            const url = URL.createObjectURL(file)
            const link = document.createElement("a")
            link.href = url
            link.download = "laporan-penjualan.xlsx"
            link.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            setError(err.message || "Gagal mengunduh laporan penjualan")
        }
    }

    return (
        <>
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Laporan</h1>
                    <p className="text-sm text-slate-500">Analisis dan penjualan lengkap</p>
                    {loading && <p className="mt-1 text-sm text-slate-500">Memuat laporan...</p>}
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <FiDownload /> Export Penjualan
                </button>
            </div>

            <FilterSection
                filters={filters}
                onChange={setFilters}
                periodOptions={PERIOD_OPTIONS}
                branches={branches}
            />

            <SummaryCard />

            <section className="mt-6 grid grid-cols-2 gap-5">
                <TrenDataAdmin />
                <PenjualanPerCabangAdmin />
            </section>

            <ProdukTerLaris products={reportData.products} stocks={reportData.stocks} />
        </>
    )
}

export default LaporanAdmin