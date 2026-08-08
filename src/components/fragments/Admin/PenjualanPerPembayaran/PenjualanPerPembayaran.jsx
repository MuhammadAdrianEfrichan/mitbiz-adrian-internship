const paymentData = [
  { label: "QRIS", value: 19, color: "#22c55e" },
  { label: "Credit Card", value: 20, color: "#f59e0b" },
  { label: "Wallet", value: 20, color: "#ef4444" },
  { label: "Tunai", value: 17, color: "#8b5cf6" },
  { label: "Debit Card", value: 24, color: "#3b82f6" },
];

const PenjualanPerPembayaran = ()=>{
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">Penjualan per Metode Pembayaran</h3>

            <div className="flex items-center justify-between gap-4">
              <div
                className="relative h-36 w-36 rounded-full"
                style={{
                  background: `conic-gradient(#22c55e 0 19%, #f59e0b 19% 39%, #ef4444 39% 59%, #8b5cf6 59% 76%, #3b82f6 76% 100%)`,
                }}
              >
                <div className="absolute inset-5.75 rounded-full bg-white" />
              </div>

              <div className="flex-1 space-y-2">
                {paymentData.map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span>{label}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
    )
}

export default PenjualanPerPembayaran