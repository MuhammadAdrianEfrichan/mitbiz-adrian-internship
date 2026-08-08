const trendData = [0.4, 0.5, 0.7, 0.55, 0.82, 0.9, 0.75, 1.1, 0.95, 0.88, 1.2, 1.4, 1.1, 0.9, 1.25, 1.55];
function buildAreaPath(data, width, height, padding) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  return data
    .map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - ((point - min) / (max - min || 1)) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

const areaPath = buildAreaPath(trendData, 720, 210, 18);
const areaFill = `${areaPath} L 702,192 L 18,192 Z`;
const TrenDataAdmin = ()=>{
    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-700">Tren Penjualan (30 Hari)</h2>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-white">
            <svg viewBox="0 0 720 210" className="h-52.5 w-full">
              {[0, 1, 2, 3, 4].map((line) => (
                <line
                  key={line}
                  x1="18"
                  x2="702"
                  y1={30 + line * 38}
                  y2={30 + line * 38}
                  stroke="#e5e7eb"
                  strokeDasharray="4 6"
                />
              ))}

              <path d={areaFill} fill="url(#areaTrend)" opacity="0.9" />
              <path
                d={areaPath}
                fill="none"
                stroke="#2f80ed"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <defs>
                <linearGradient id="areaTrend" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg">
              Rp 356.924
            </div>

            <div className="mt-3 flex justify-between px-2 text-[11px] text-slate-500">
              {['24 Jan', '26 Jan', '28 Jan', '30 Jan', '02 Feb', '04 Feb', '06 Feb', '08 Feb', '10 Feb', '12 Feb', '14 Feb', '16 Feb'].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </section>
    )
}

export default TrenDataAdmin