const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`

const ProdukTerLaris = ({ products = [], stocks = [] }) => {
    const stockByProductId = stocks.reduce((acc, item) => {
        const id = item.productId ?? item.id
        acc[id] = item.stock ?? item.quantity ?? item.qty ?? 0
        return acc
    }, {})

    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-[1.05rem] font-semibold text-slate-700">
                Produk Terlaris ({products.length} Produk)
            </h3>
            {products.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">Belum ada data produk untuk periode ini.</p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                        <thead>
                            <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                                <th className="px-4 py-3">Produk</th>
                                <th className="px-4 py-3">Terjual</th>
                                <th className="px-4 py-3">Pendapatan</th>
                                <th className="px-4 py-3">Stok Tersisa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id ?? product.productId} className="border-t border-slate-200 bg-white">
                                    <td className="px-4 py-3 font-medium text-slate-700">{product.name ?? product.productName ?? "-"}</td>
                                    <td className="px-4 py-3">{product.soldQuantity ?? product.totalSold ?? product.qtySold ?? 0}</td>
                                    <td className="px-4 py-3">{formatRupiah(product.revenue ?? product.totalRevenue ?? 0)}</td>
                                    <td className="px-4 py-3">{stockByProductId[product.id ?? product.productId] ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default ProdukTerLaris