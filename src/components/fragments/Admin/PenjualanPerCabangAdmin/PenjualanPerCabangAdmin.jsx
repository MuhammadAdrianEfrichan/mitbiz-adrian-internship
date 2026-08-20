const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`

const PenjualanPerCabangAdmin = ({ data = [] }) => {
    const chartData = data.map((item) => ({
        name: item.name ?? item.outletName ?? item.branchName ?? "-",
        sales: Number(item.sales ?? item.totalSales ?? item.totalPenjualan ?? 0),
    }))
    const maxSales = Math.max(...chartData.map((item) => item.sales), 1)

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-[1.05rem] font-semibold text-slate-700">Penjualan per Cabang</h3>
            {chartData.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">Belum ada data untuk periode ini.</p>
            ) : (
                <div className="flex h-70 items-end gap-3 overflow-x-auto pb-7">
                    {chartData.map((item) => (
                        <div key={item.name} className="relative flex h-full min-w-20 flex-1 items-end justify-center">
                            <div
                                className="w-12 rounded-t-lg bg-blue-700"
                                style={{ height: `${Math.max((item.sales / maxSales) * 92, 4)}%` }}
                                title={`${item.name}: ${formatRupiah(item.sales)}`}
                            />
                            <span className="absolute bottom-0 max-w-24 truncate text-center text-[11px] text-slate-500">{item.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PenjualanPerCabangAdmin