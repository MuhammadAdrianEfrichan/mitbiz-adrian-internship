const barSales = [
  { label: "Jakarta Pusat", value: 62 },
  { label: "Jakarta Selatan", value: 58 },
  { label: "Tangerang", value: 80 },
  { label: "Padang", value: 45 },
];

const PenjualanPerCabangAdmin = ()=>{
    return(

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">Penjualan per Cabang</h3>

            <div className="flex h-45 items-end gap-5">
              {barSales.map(({ label, value }) => (
                <div key={label} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="relative flex w-full items-end justify-center">
                    <div
                      className="w-full rounded-t-xl bg-slate-300"
                      style={{ height: `${value * 1.3}px` }}
                    />
                    <div
                      className="absolute bottom-0 left-1/2 w-[90%] -translate-x-1/2 rounded-t-xl bg-[#2f80ed]"
                      style={{ height: `${value * 1.6}px` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
    )
}
export default PenjualanPerCabangAdmin