import { useState } from "react"

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`

// Format label sumbu-Y: otomatis pakai "jt" (juta) atau "rb" (ribu) sesuai skala
const formatAxisValue = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}rb`
    return String(Math.round(value))
}

// Bulatkan nilai maksimum ke angka "rapi" (1/2/5 x 10^n) agar label sumbu-Y
// tidak berantakan, mis. 12jt bukan 11.3jt
const getNiceMax = (value) => {
    if (value <= 0) return 1
    const exponent = Math.floor(Math.log10(value))
    const magnitude = Math.pow(10, exponent)
    const residual = value / magnitude
    let niceResidual = 10
    if (residual <= 1) niceResidual = 1
    else if (residual <= 2) niceResidual = 2
    else if (residual <= 5) niceResidual = 5
    return niceResidual * magnitude
}

const TICKS = 4 // menghasilkan 5 label: 0, 1/4, 2/4, 3/4, max

const PenjualanPerCabangAdmin = ({ data = [] }) => {
    const [hoverIndex, setHoverIndex] = useState(null)

    const chartData = data.map((item) => ({
        name: item.name ?? item.outletName ?? item.branchName ?? item.outlet?.name ?? item.branch?.name ?? "-",
        sales: Number(item.sales ?? item.totalSales ?? item.totalPenjualan ?? item.totalAmount ?? item.amount ?? item.revenue ?? 0),
    }))

    const rawMax = Math.max(...chartData.map((item) => item.sales), 1)
    const axisMax = getNiceMax(rawMax)
    const axisLabels = Array.from({ length: TICKS + 1 }, (_, i) => (axisMax / TICKS) * (TICKS - i))

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-[1.05rem] font-semibold text-slate-700">Penjualan per Cabang</h3>
            {chartData.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">Belum ada data untuk periode ini.</p>
            ) : (
                <div className="flex gap-3">
                    {/* Label sumbu-Y */}
                    <div className="flex h-64 flex-col justify-between pb-8 text-right text-[11px] text-slate-400">
                        {axisLabels.map((label, index) => (
                            <span key={index}>{formatAxisValue(label)}</span>
                        ))}
                    </div>

                    <div className="relative flex-1">
                        {/* Garis grid horizontal */}
                        <div className="absolute inset-x-0 top-0 flex h-64 flex-col justify-between pb-8">
                            {axisLabels.map((_, index) => (
                                <div key={index} className="border-t border-dashed border-slate-200" />
                            ))}
                        </div>

                        {/* Bar chart */}
                        <div className="relative flex h-64 items-end gap-3 pb-8">
                            {chartData.map((item, index) => (
                                <div
                                    key={`branch-${item.id ?? item.name ?? index}-${index}`}
                                    className="relative flex h-full min-w-16 flex-1 flex-col items-center justify-end"
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onMouseLeave={() => setHoverIndex((current) => (current === index ? null : current))}
                                >
                                    {hoverIndex === index && (
                                        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white shadow-lg">
                                            <p className="font-semibold">{item.name}</p>
                                            <p>{formatRupiah(item.sales)}</p>
                                        </div>
                                    )}
                                    <div
                                        className="w-10 rounded-t-lg bg-blue-700 transition-all hover:bg-blue-600"
                                        style={{ height: `${Math.max((item.sales / axisMax) * 100, 2)}%` }}
                                    />
                                    <span className="absolute -bottom-6 left-0 right-0 truncate text-center text-[11px] text-slate-500">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PenjualanPerCabangAdmin