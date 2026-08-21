const DEFAULT_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#14b8a6", "#ec4899", "#64748b"]

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`

const PenjualanPerPembayaran = ({ data = [] }) => {
   const rawItems = data.map((item, index) => ({
    label: item.paymentMethod ?? item.name ?? item.label ?? item.methodName ?? "-",
    value: Number(item.totalAmount ?? item.sales ?? item.value ?? 0),
    percentage: Number(item.percentage ?? 0), // langsung pakai dari backend
    color: item.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
}))

// Kalau backend tidak kirim percentage (percentage = 0 tapi value > 0), hitung manual sebagai fallback
const total = rawItems.reduce((sum, item) => sum + item.value, 0)
const paymentData = rawItems.map((item) => ({
    ...item,
    percentage: item.percentage > 0 ? item.percentage : (total > 0 ? (item.value / total) * 100 : 0),
}))
    // Bangun stop conic-gradient secara dinamis berdasarkan persentase kumulatif
    let cumulative = 0
    const gradientStops = paymentData.map((item) => {
        const start = cumulative
        cumulative += item.percentage
        return `${item.color} ${start}% ${cumulative}%`
    })
    const conicGradient = gradientStops.length > 0 ? `conic-gradient(${gradientStops.join(", ")})` : "#e2e8f0"

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">Penjualan per Metode Pembayaran</h3>

            {paymentData.length === 0 || total === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">Belum ada data untuk periode ini.</p>
            ) : (
                <div className="flex items-center justify-between gap-4">
                    <div
                        className="relative h-36 w-36 shrink-0 rounded-full"
                        style={{ background: conicGradient }}
                    >
                        <div className="absolute inset-5.75 rounded-full bg-white" />
                    </div>

                    <div className="flex-1 space-y-2">
                        {paymentData.map(({ label, value, percentage, color }) => (
                            <div key={label} className="flex items-center justify-between gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="truncate">{label}</span>
                                </div>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span className="text-xs text-slate-400">{formatRupiah(value)}</span>
                                    <span className="font-semibold text-slate-700">{percentage.toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PenjualanPerPembayaran