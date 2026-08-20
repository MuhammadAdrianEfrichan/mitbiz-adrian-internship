const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`
const formatDateLabel = (value) => {
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
}

const TrenDataAdmin = ({ data = [] }) => {
    const chartData = data.map((item) => ({
        date: item.date ?? item.tanggal ?? item.createdAt,
        sales: Number(item.sales ?? item.totalSales ?? item.totalPenjualan ?? 0),
    }))
    const maxSales = Math.max(...chartData.map((item) => item.sales), 1)
    const points = chartData.map((item, index) => {
        const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100
        const y = 100 - (item.sales / maxSales) * 88
        return `${x},${y}`
    }).join(" ")

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-[1.05rem] font-semibold text-slate-700">Tren Penjualan</h3>
            {chartData.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">Belum ada data untuk periode ini.</p>
            ) : (
                <div className="relative h-70 w-full">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                        {[12, 34, 56, 78].map((y) => (
                            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="1.5 1.5" />
                        ))}
                        <polyline points={points} fill="none" stroke="#1d4ed8" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="mt-2 flex justify-between gap-2 overflow-hidden text-[11px] text-slate-500">
                        {chartData.filter((_, index) => index === 0 || index === chartData.length - 1 || index % Math.ceil(chartData.length / 5) === 0).map((item, index) => (
                            <span key={`${item.date}-${index}`}>{formatDateLabel(item.date)}</span>
                        ))}
                    </div>
                    <p className="mt-2 text-right text-xs text-slate-500">Total: {formatRupiah(chartData.reduce((total, item) => total + item.sales, 0))}</p>
                </div>
            )}
        </div>
    )
}

export default TrenDataAdmin