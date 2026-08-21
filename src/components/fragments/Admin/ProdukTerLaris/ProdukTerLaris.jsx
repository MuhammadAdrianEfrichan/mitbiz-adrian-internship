const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`

const getProductName = (product) =>
    product.name ?? product.productName ?? product.product?.name ?? "-"

const getSoldQuantity = (product) =>
    Number(product.quantitySold ?? product._sum?.quantity ?? product.soldQuantity ?? product.totalSold ?? 0)

const getRevenue = (product) =>
    Number(product.totalAmount ?? product._sum?.subtotal ?? product.revenue ?? product.totalRevenue ?? 0)

const ProdukTerLaris = ({ products = [], stocks = [] }) => {
    const stockBySku = stocks.reduce((acc, item) => {
        const sku = item.productSku ?? item.sku ?? item.product?.sku
        if (sku) acc[sku] = item.stock ?? item.quantity ?? item.qty ?? 0
        return acc
    }, {})

    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-[1.05rem] font-semibold text-slate-700">
                Produk Terlaris ({Math.min(products.length, 10)} Produk)
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
                            </tr>
                        </thead>
                        <tbody>
                            {products.slice(0, 10).map((product, index) => {
                                const sku = product.productSku ?? product.sku
                                return (
                                    <tr
                                        key={`product-${sku ?? getProductName(product) ?? index}-${index}`}
                                        className="border-t border-slate-200 bg-white"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-700">{getProductName(product)}</td>
                                        <td className="px-4 py-3">{getSoldQuantity(product)}</td>
                                        <td className="px-4 py-3">{formatRupiah(getRevenue(product))}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default ProdukTerLaris