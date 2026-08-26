import { useEffect, useState } from "react"
import { FiDownload } from "react-icons/fi"
import FilterSection from "../../../fragments/Admin/FilterSection"
import PenjualanPerCabangAdmin from "../../../fragments/Admin/PenjualanPerCabangAdmin"
import ProdukTerLaris from "../../../fragments/Admin/ProdukTerLaris"
import SummaryCard from "../../../fragments/Admin/SummaryCard"
import TrenDataAdmin from "../../../fragments/Admin/TrendDataAdmin"
import { getBranches } from "../../../../services/Admin/branch.service"
import {
    downloadSalesReport,
    getSalesReport,
    getProductsReport,
    getStocksReport,
} from "../../../../services/Admin/laporan.service"
import { getKasir } from "../../../../services/Admin/kasir.service"
import { getProduct } from "../../../../services/Admin/product.service"

const getReportList = (response) => {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.data?.data)) return response.data.data
    if (Array.isArray(response?.results)) return response.results
    if (Array.isArray(response?.products)) return response.products
    if (Array.isArray(response?.stocks)) return response.stocks
    if (Array.isArray(response?.data?.products)) return response.data.products
    if (Array.isArray(response?.data?.stocks)) return response.data.stocks
    if (Array.isArray(response?.data?.results)) return response.data.results
    return []
}

const PERIOD_OPTIONS = [
    { value: "7", label: "7 Hari Terakhir" },
    { value: "30", label: "30 Hari Terakhir" },
    { value: "90", label: "90 Hari Terakhir" },
]

const getDateRange = (period) => {
    const end = new Date()
    const days = Number.parseInt(period, 10) || 30
    const start = new Date(end)
    start.setDate(end.getDate() - days + 1)
    const toDate = (date) => date.toISOString().slice(0, 10)
    return { startDate: toDate(start), endDate: toDate(end) }
}
const toDateKey = (value) => {
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

const aggregateDailySales = (salesList) => {
    const grouped = salesList.reduce((acc, item) => {
        const rawDate = item.date ?? item.tanggal ?? item.createdAt ?? item.transactionDate ?? item.created_at
        const dateKey = toDateKey(rawDate)
        if (!dateKey) return acc
        if (!acc[dateKey]) acc[dateKey] = { date: dateKey, sales: 0 }
        acc[dateKey].sales += getSalesValue(item)
        return acc
    }, {})
    return Object.values(grouped)
}

// Isi tanggal yang tidak ada transaksinya dengan 0, supaya grafik mencakup
// seluruh rentang periode yang dipilih (7/30/90 hari), bukan cuma hari yang ada datanya
const fillDateRange = (dailySales, startDate, endDate) => {
    const salesByDate = new Map(dailySales.map((item) => [toDateKey(item.date), Number(item.sales) || 0]))
    const result = []
    const cursor = new Date(startDate)
    const end = new Date(endDate)
    while (cursor <= end) {
        const dateKey = cursor.toISOString().slice(0, 10)
        result.push({ date: dateKey, sales: salesByDate.get(dateKey) ?? 0 })
        cursor.setDate(cursor.getDate() + 1)
    }
    return result
}

const getSalesList = (response) => {
    const source = response?.data?.data ?? response?.data ?? response
    if (Array.isArray(source)) return source
    return source?.sales ?? source?.transactions ?? source?.rows ?? source?.results ?? source?.data ?? source?.dailySales ?? []
}

const findValue = (source, keys, visited = new Set()) => {
    if (!source || typeof source !== "object" || visited.has(source)) return undefined
    visited.add(source)
    for (const key of keys) {
        if (source[key] !== undefined) return source[key]
    }
    for (const value of Object.values(source)) {
        const result = findValue(value, keys, visited)
        if (result !== undefined) return result
    }
    return undefined
}

const toList = (value) => {
    if (Array.isArray(value)) return value
    if (Array.isArray(value?.data)) return value.data
    return []
}

const getSalesValue = (item) => Number(item.totalSales ?? item.totalPenjualan ?? item.totalAmount ?? item.total ?? item.sales ?? item.revenue ?? item.amount ?? 0)
const aggregateBranchSales = (salesList, branchList) => {
    const grouped = salesList.reduce((result, item) => {
        const branchId = item.branchId ?? item.outletId ?? item.branch?.id ?? item.outlet?.id ?? item.branchName ?? item.outletName
        if (!branchId) return result
        if (!result[branchId]) {
            result[branchId] = {
                name: item.branch?.name ?? item.outlet?.name ?? item.branchName ?? item.outletName ?? branchList.find((branch) => String(branch.id) === String(branchId))?.name ?? "-",
                sales: 0,
            }
        }
        result[branchId].sales += getSalesValue(item)
        return result
    }, {})
    return Object.values(grouped)
}

const LaporanAdmin = () => {
    const [reportData, setReportData] = useState({ products: [], stocks: [] })
    const [summary, setSummary] = useState(null)
    const [trend, setTrend] = useState([])
    const [byBranch, setByBranch] = useState([])
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [cashiers, setCashiers] = useState([])
    const [allProducts, setAllProducts] = useState([])


    const isActiveEntity = (entity) => {
    const status = String(entity.status ?? "").toLowerCase()
    if (status) return status === "active" || status === "aktif"
    return entity.isActive ?? true 
}

useEffect(() => {
    const fetchMasterData = async () => {
        try {
            const [cashierRes, productRes] = await Promise.all([
                getKasir(),
                getProduct(),
            ])
            setCashiers(getReportList(cashierRes))
            setAllProducts(getReportList(productRes))
        } catch (err) {
            console.error("Gagal mengambil data kasir/produk:", err)
        }
    }
    fetchMasterData()
}, [])

    const [filters, setFilters] = useState({
                    period: "30",
                    branchId: "",
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
                const { startDate, endDate } = getDateRange(filters.period)
                const params = {
                    startDate,
                    endDate,
                    branchId: filters.branchId || undefined,
                    category: filters.category || undefined,
                }

                const [salesResult, productsResult, stocksResult] = await Promise.allSettled([
                    getSalesReport(params),
                    getProductsReport(params),
                    getStocksReport(params),
                ])

                const sales = salesResult.status === "fulfilled" ? salesResult.value : []
                const products = productsResult.status === "fulfilled" ? productsResult.value : []
                const stocks = stocksResult.status === "fulfilled" ? stocksResult.value : []
                const salesList = getSalesList(sales)
                const salesTotal = salesList.reduce((total, item) => total + getSalesValue(item), 0)
                const salesSummary = findValue(sales, ["summary", "ringkasan"]) ?? {}
                const dailySalesRaw = toList(findValue(sales, ["dailySales", "salesByDate", "trend", "daily", "perDay"]))
                const aggregatedDailySales = dailySalesRaw.length > 0 ? dailySalesRaw : aggregateDailySales(salesList)
                const filledTrend = fillDateRange(aggregatedDailySales, startDate, endDate)
                const branchSales = toList(findValue(sales, ["branchSales", "salesByBranch", "byBranch", "branches", "perBranch"]))
                const aggregatedBranchSales = branchSales.length > 0 ? branchSales : aggregateBranchSales(salesList, branches)

                setReportData({
                    products: getReportList(products),
                    stocks: getReportList(stocks),
                })
                console.log("Sample produk mentah:", getReportList(products)[0])
                setSummary({
    totalSales: salesSummary.totalSales ?? salesSummary.totalPenjualan ?? salesTotal,
    totalTransactions: salesSummary.totalTransactions ?? salesSummary.totalTransaksi ?? salesList.length,
    periodLabel: PERIOD_OPTIONS.find((option) => option.value === filters.period)?.label,
    totalBranches: branches.length,
    activeBranches: branches.filter(isActiveEntity).length,
    totalCashiers: cashiers.length,
    activeCashiers: cashiers.filter(isActiveEntity).length,
    totalProducts: allProducts.length,
    activeProducts: allProducts.filter(isActiveEntity).length,
})
                setTrend(filledTrend)
                setByBranch(aggregatedBranchSales)

                const failedReports = [salesResult, productsResult, stocksResult].filter((result) => result.status === "rejected")
                if (failedReports.length === 3) {
                    throw failedReports[0].reason
                }
            } catch (err) {
                setError(err.message || "Gagal mengambil data laporan")
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    },  [filters, branches, cashiers, allProducts])

    const handleExport = async () => {
        try {
            const file = await downloadSalesReport({
                ...getDateRange(filters.period),
                branchId: filters.branchId || undefined,
                format: "excel",
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
            <div className="-mt-2 mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Laporan</h1>
                    <p className="text-base text-slate-500">Analisis dan penjualan lengkap</p>
                    {loading && <p className="mt-1 text-sm text-slate-500">Memuat laporan...</p>}
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700"
                >
                    <FiDownload /> Export Penjualan
                </button>
            </div>

            <FilterSection
                filters={filters}
                onChange={setFilters}
                periodOptions={PERIOD_OPTIONS}
                branches={branches}
                branchField="branchId"
            />

            <SummaryCard summary={summary} />

            <section className="mt-6 grid grid-cols-2 gap-5">
                <TrenDataAdmin data={trend} />
                <PenjualanPerCabangAdmin data={byBranch} />
            </section>

            <ProdukTerLaris products={reportData.products} stocks={reportData.stocks} />
        </>
    )
}

export default LaporanAdmin