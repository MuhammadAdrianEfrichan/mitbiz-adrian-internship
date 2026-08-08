const productBars = [
  { label: "Nasi Goreng", value: 12 },
  { label: "Mie Goreng", value: 18 },
  { label: "Coklat Batang", value: 9 },
  { label: "Keripik Kentang", value: 11 },
  { label: "Buku Tulis", value: 8 },
  { label: "Es Teh Manis", value: 7 },
  { label: "Pulpen Biru", value: 5 },
];


const ProdukTerLaris = ()=>{
    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-700">Produk Terlaris (7 Produk)</h3>

          <div className="flex h-50 items-end gap-5">
            {productBars.map(({ label, value }) => (
              <div key={label} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="relative flex w-full items-end justify-center">
                  <div
                    className="w-full rounded-t-xl bg-[#2f80ed]"
                    style={{ height: `${value * 10}px` }}
                  />
                </div>
                <span className="text-center text-[11px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>
    )
}
export default ProdukTerLaris