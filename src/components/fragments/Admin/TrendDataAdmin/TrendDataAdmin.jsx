import { useMemo, useState } from "react"

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`
const formatDateLabel = (value) => {
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
}

const CHART_HEIGHT = 100
const CHART_TOP_PADDING = 12
const CHART_BOTTOM_PADDING = 12

const TrenDataAdmin = ({ data = [] }) => {
    const [hoverIndex, setHoverIndex] = useState(null)

    const chartData = data
    .map((item) => ({
        date: item.date ?? item.tanggal ?? item.createdAt ?? item.period,
        sales: Number(item.amount ?? item.sales ?? item.totalSales ?? item.totalAmount ?? 0),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

    const maxSales = Math.max(...chartData.map((item) => item.sales), 1)
    const usableHeight = CHART_HEIGHT - CHART_TOP_PADDING - CHART_BOTTOM_PADDING

    const coords = chartData.map((item, index) => {
        const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100
        const y = CHART_HEIGHT - CHART_BOTTOM_PADDING - (item.sales / maxSales) * usableHeight
        return { x, y, ...item }
    })

    const linePoints = coords.map((point) => `${point.x},${point.y}`).join(" ")
    const areaPoints = coords.length > 0 ? `0,${CHART_HEIGHT} ${linePoints} 100,${CHART_HEIGHT}` : ""

    // Pilih maksimal 5 label, unik, tersebar rata — mencegah "20 Agu" berulang
    const labelIndices = useMemo(() => {
        if (chartData.length <= 1) return chartData.map((_, i) => i)
        const step = Math.max(1, Math.ceil(chartData.length / 5))
        const indices = new Set()
        for (let i = 0; i < chartData.length; i += step) indices.add(i)
        indices.add(chartData.length - 1)
        return Array.from(indices).sort((a, b) => a - b)
    }, [chartData])

    const total = chartData.reduce((sum, item) => sum + item.sales, 0)
    const hovered = hoverIndex !== null ? coords[hoverIndex] : null

    const handleMouseMove = (event) => {
        if (coords.length === 0) return
        const bounds = event.currentTarget.getBoundingClientRect()
        const ratio = (event.clientX - bounds.left) / bounds.width
        const index = Math.round(ratio * (coords.length - 1))
        setHoverIndex(Math.min(Math.max(index, 0), coords.length - 1))
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[1.05rem] font-semibold text-slate-700">Tren Penjualan Harian</h3>
                <p className="text-xs text-slate-500">Total: {formatRupiah(total)}</p>
            </div>

            {chartData.length === 0 ? (
                <p className="py-16 text-center text-sm text-slate-500">Belum ada data untuk periode ini.</p>
            ) : (
                <div className="relative">
                    <div
                        className="relative h-64 w-full"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <svg viewBox={`0 0 100 ${CHART_HEIGHT}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
                            <defs>
                                <linearGradient id="trenFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {[0.25, 0.5, 0.75, 1].map((fraction) => (
                                <line
                                    key={fraction}
                                    x1="0" x2="100"
                                    y1={CHART_TOP_PADDING + usableHeight * fraction}
                                    y2={CHART_TOP_PADDING + usableHeight * fraction}
                                    stroke="#e2e8f0"
                                    strokeDasharray="1.5 1.5"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}

                            <polygon points={areaPoints} fill="url(#trenFill)" stroke="none" />
                            <polyline
                                points={linePoints}
                                fill="none"
                                stroke="#1d4ed8"
                                strokeWidth="1.2"
                                vectorEffect="non-scaling-stroke"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />

                            {hovered && (
                                <line
                                    x1={hovered.x} x2={hovered.x}
                                    y1={CHART_TOP_PADDING} y2={CHART_HEIGHT - CHART_BOTTOM_PADDING}
                                    stroke="#94a3b8"
                                    strokeWidth="0.6"
                                    vectorEffect="non-scaling-stroke"
                                />
                            )}
                            {hovered && (
                                <circle cx={hovered.x} cy={hovered.y} r="1.8" fill="#1d4ed8" stroke="white" strokeWidth="0.8" />
                            )}
                        </svg>

                        {hovered && (
                            <div
                                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white shadow-lg"
                                style={{ left: `${hovered.x}%`, top: `${(hovered.y / CHART_HEIGHT) * 100}%` }}
                            >
                                <p className="font-semibold">{formatDateLabel(hovered.date)}</p>
                                <p>{formatRupiah(hovered.sales)}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                        {labelIndices.map((index) => (
                            <span key={chartData[index].date}>{formatDateLabel(chartData[index].date)}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrenDataAdmin