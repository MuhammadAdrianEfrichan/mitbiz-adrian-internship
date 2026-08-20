const FilterSection = ({ filters, onChange, periodOptions = [], branches = [] }) => {
    const handleFieldChange = (field) => (event) => {
        onChange((current) => ({ ...current, [field]: event.target.value }))
    }

    return (
        <section className="mb-6 grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="text-sm font-medium text-slate-700">
                Periode
                <select
                    value={filters.period}
                    onChange={handleFieldChange("period")}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                    {periodOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
                Cabang
                <select
                    value={filters.outletId}
                    onChange={handleFieldChange("outletId")}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Semua Cabang</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
                Kategori
                <select
                    value={filters.category}
                    onChange={handleFieldChange("category")}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Produk Terlaris</option>
                    <option value="slow-moving">Produk Kurang Laris</option>
                </select>
            </label>
        </section>
    )
}

export default FilterSection