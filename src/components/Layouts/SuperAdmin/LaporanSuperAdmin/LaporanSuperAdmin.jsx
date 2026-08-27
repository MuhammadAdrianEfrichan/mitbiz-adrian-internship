import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiDownload, FiFileText, FiLoader } from "react-icons/fi";
import {
	getSalesReport,
	getProductsReport,
	getStocksReport,
	downloadSalesReport,
} from "../../../../services/SuperAdmin/laporansuper.service"; 
import { getBisnis } from "../../../../services/SuperAdmin/manajementbisnis.service"; 

const formatRupiah = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value || 0);

const normalizeSalesSummary = (res) => {
	const d = res?.data ?? res ?? {};
	return {
		totalRevenue: d.totalRevenue ?? d.grossRevenue ?? d.totalPendapatan ?? 0,
		totalTransactions: d.totalTransactions ?? d.transactionCount ?? d.totalTransaksi ?? 0,
		avgTransaction: d.averageTransaction ?? d.avgTransaction ?? d.rataRataTransaksi ?? 0,
		totalDiscount: d.totalDiscount ?? d.totalDiskon ?? 0,
	};
};

const normalizeProductsReport = (res) => {
	const list = res?.data ?? [];
	if (!Array.isArray(list)) return [];
	return list.map((p, idx) => ({
		id: p.id ?? p.productId ?? idx,
		rank: idx + 1,
		name: p.name ?? p.productName ?? p.product?.name ?? "-",
		quantity: p.quantitySold ?? p.qty ?? p.totalQuantity ?? p.quantity ?? 0,
		revenue: p.revenue ?? p.totalRevenue ?? p.totalPendapatan ?? 0,
	}));
};

const stockStatus = (item) => {
	const qty = item.quantity ?? 0;
	if (item.quantity === null || qty <= 0) return { label: "Stok Habis", className: "bg-red-100 text-red-600" };
	if (qty <= (item.minQuantity ?? 0)) return { label: "Stok Rendah", className: "bg-amber-100 text-amber-600" };
	return { label: "Aman", className: "bg-[#1c86ef]/10 text-[#1c86ef]" };
};

const normalizeStockReport = (res) => {
	const list = res?.data ?? [];
	if (!Array.isArray(list)) return [];
	return list.map((item) => ({
		id: item.id,
		outlet: item.outlet?.name ?? "-",
		product: item.product?.name ?? "-",
		sku: item.product?.sku ?? "-",
		category: item.product?.category?.name ?? "-",
		quantity: item.quantity,
		minQuantity: item.minQuantity ?? 0,
		status: stockStatus(item),
	}));
};

const REPORT_TYPES = [
	{ value: "sales", label: "Laporan Penjualan" },
	{ value: "products", label: "Laporan Produk Terlaris" },
	{ value: "stock", label: "Laporan Stok" },
];

const SelectField = ({ label, value, onChange, options = [], disabled }) => (
	<label className="block min-w-0 flex-1">
		<span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
		<span className="relative block">
			<select
				disabled={disabled}
				value={value ?? ""}
				onChange={(e) => onChange?.(e.target.value)}
				className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 disabled:opacity-60"
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			<FiChevronDown className="pointer-events-none absolute right-3 top-3.5 text-slate-400" size={16} />
		</span>
	</label>
);

const DateField = ({ label, value, onChange, disabled }) => (
	<label className="block min-w-0 flex-1">
		<span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
		<input
			type="date"
			disabled={disabled}
			value={value ?? ""}
			onChange={(e) => onChange?.(e.target.value)}
			className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 outline-none placeholder:text-slate-400 disabled:opacity-60"
		/>
	</label>
);

const SummaryCard = ({ label, value, detail, icon: Icon = FiFileText }) => (
	<article className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm">
		<div className="flex items-start justify-between gap-2">
			<h2 className="text-sm font-medium text-slate-700">{label}</h2>
			<span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400">
				<Icon size={14} />
			</span>
		</div>
		<p className="mt-5 text-2xl font-semibold text-slate-800">{value}</p>
		<p className="mt-1 text-xs text-slate-400">{detail}</p>
	</article>
);

const LaporanSuperAdmin = () => {
	const [reportType, setReportType] = useState("sales");
	const [businessOptions, setBusinessOptions] = useState([]);
	const [outletsByBusiness, setOutletsByBusiness] = useState({});
	const [businessId, setBusinessId] = useState("");
	const [outletId, setOutletId] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [salesSummary, setSalesSummary] = useState(null);
	const [products, setProducts] = useState([]);
	const [stocks, setStocks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [error, setError] = useState(null);

	// Ambil daftar bisnis & cabang dari outlet list (untuk dropdown filter)
	useEffect(() => {
		getBisnis()
			.then((res) => {
				const list = res?.data?.data ?? [];
				const bizMap = new Map();
				const outletMap = {};
				list.forEach((o) => {
					if (o.businessId && !bizMap.has(o.businessId)) {
						bizMap.set(o.businessId, { value: o.businessId, label: o.business?.name ?? o.businessId });
					}
					if (o.businessId) {
						if (!outletMap[o.businessId]) outletMap[o.businessId] = [];
						outletMap[o.businessId].push({ value: o.id, label: o.name });
					}
				});
				setBusinessOptions(Array.from(bizMap.values()));
				setOutletsByBusiness(outletMap);
			})
			.catch(() => {
				// Gagal ambil daftar bisnis tidak fatal untuk halaman laporan; filter cukup jadi kosong.
			});
	}, []);

	const outletOptions = useMemo(
		() => outletsByBusiness[businessId] || [],
		[outletsByBusiness, businessId]
	);

	const params = useMemo(() => {
		const p = {};
		if (businessId) p.businessId = businessId;
		if (outletId) p.outletId = outletId;
		if (startDate) p.startDate = startDate;
		if (endDate) p.endDate = endDate;
		return p;
	}, [businessId, outletId, startDate, endDate]);

	const loadReport = () => {
		setLoading(true);
		setError(null);

		if (reportType === "sales") {
			Promise.all([getSalesReport(params), getProductsReport(params)])
				.then(([salesRes, productsRes]) => {
					setSalesSummary(normalizeSalesSummary(salesRes));
					setProducts(normalizeProductsReport(productsRes));
				})
				.catch((err) => setError(err.message || "Gagal mengambil laporan penjualan"))
				.finally(() => setLoading(false));
		} else if (reportType === "products") {
			getProductsReport(params)
				.then((res) => setProducts(normalizeProductsReport(res)))
				.catch((err) => setError(err.message || "Gagal mengambil laporan produk terlaris"))
				.finally(() => setLoading(false));
		} else {
			getStocksReport(params)
				.then((res) => setStocks(normalizeStockReport(res)))
				.catch((err) => setError(err.message || "Gagal mengambil laporan stok"))
				.finally(() => setLoading(false));
		}
	};

	useEffect(() => {
		loadReport();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reportType, businessId, outletId, startDate, endDate]);

	const handleExport = async () => {
		setExporting(true);
		setError(null);
		try {
			const blob = await downloadSalesReport(params);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `laporan-penjualan-${Date.now()}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (err) {
			setError(err.message || "Gagal mengunduh laporan");
		} finally {
			setExporting(false);
		}
	};

	const stockCounts = useMemo(() => {
		const habis = stocks.filter((s) => s.status.label === "Stok Habis").length;
		const rendah = stocks.filter((s) => s.status.label === "Stok Rendah").length;
		return { total: stocks.length, habis, rendah, aman: stocks.length - habis - rendah };
	}, [stocks]);

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Laporan Komprehensif</h1>
					<p className="mt-1 text-base text-slate-500">Generate dan analisis laporan bisnis</p>
				</div>
				<button
					type="button"
					onClick={handleExport}
					disabled={exporting || reportType !== "sales"}
					title={reportType !== "sales" ? "Export hanya tersedia untuk Laporan Penjualan" : undefined}
					className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc] disabled:opacity-50"
				>
					{exporting ? <FiLoader className="animate-spin" size={17} /> : <FiDownload size={17} />}
					Export Laporan
				</button>
			</header>

			<section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<h2 className="text-base font-semibold text-slate-700">Filter Laporan</h2>
				<div className="mt-3 flex flex-wrap gap-3">
					<SelectField
						label="Jenis Laporan"
						value={reportType}
						onChange={setReportType}
						options={REPORT_TYPES}
					/>
					<SelectField
						label="Bisnis"
						value={businessId}
						onChange={(v) => {
							setBusinessId(v);
							setOutletId("");
						}}
						options={[{ value: "", label: "Semua Bisnis" }, ...businessOptions]}
					/>
					<SelectField
						label="Cabang"
						value={outletId}
						onChange={setOutletId}
						disabled={!businessId}
						options={[{ value: "", label: "Semua Cabang" }, ...outletOptions]}
					/>
					<DateField
						label="Tanggal Mulai"
						value={startDate}
						onChange={setStartDate}
						disabled={reportType === "stock"}
					/>
					<DateField
						label="Tanggal Akhir"
						value={endDate}
						onChange={setEndDate}
						disabled={reportType === "stock"}
					/>
				</div>
			</section>

			{loading && (
				<div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
					<FiLoader className="animate-spin" size={20} />
					<span className="text-sm">Memuat laporan...</span>
				</div>
			)}

			{!loading && error && <div className="mt-8 text-center text-sm text-red-500">{error}</div>}

			{!loading && !error && reportType === "sales" && (
				<>
					<section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan laporan">
						<SummaryCard label="Total Pendapatan" value={formatRupiah(salesSummary?.totalRevenue)} detail="Pendapatan kotor" />
						<SummaryCard label="Total Transaksi" value={salesSummary?.totalTransactions ?? 0} detail="Jumlah transaksi" />
						<SummaryCard label="Rata-rata Transaksi" value={formatRupiah(salesSummary?.avgTransaction)} detail="Per transaksi" />
						<SummaryCard label="Total Diskon" value={formatRupiah(salesSummary?.totalDiscount)} detail="Diskon diberikan" />
					</section>
					<ProductsTable products={products.slice(0, 10)} title="10 Produk Terlaris" />
				</>
			)}

			{!loading && !error && reportType === "products" && (
				<ProductsTable products={products} title="Semua Produk Terlaris" />
			)}

			{!loading && !error && reportType === "stock" && (
				<>
					<section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan stok">
						<SummaryCard label="Total SKU" value={stockCounts.total} detail="Produk terpantau" />
						<SummaryCard label="Stok Habis" value={stockCounts.habis} detail="Perlu restock segera" />
						<SummaryCard label="Stok Rendah" value={stockCounts.rendah} detail="Mendekati batas minimum" />
						<SummaryCard label="Stok Aman" value={stockCounts.aman} detail="Di atas batas minimum" />
					</section>
					<StockTable stocks={stocks} />
				</>
			)}
		</main>
	);
};

const ProductsTable = ({ products, title }) => (
	<section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<h2 className="text-base font-semibold text-slate-700">{title}</h2>
		<div className="mt-3 overflow-x-auto">
			<table className="w-full min-w-175 table-fixed text-left text-sm text-slate-600">
				<thead className="bg-slate-100 text-slate-700">
					<tr>
						<th className="w-[15%] rounded-l-lg px-3 py-2 font-medium">Peringkat</th>
						<th className="w-[35%] px-3 py-2 font-medium">Produk</th>
						<th className="w-[25%] px-3 py-2 font-medium">Jumlah Terjual</th>
						<th className="w-[25%] rounded-r-lg px-3 py-2 font-medium">Total Pendapatan</th>
					</tr>
				</thead>
				<tbody>
					{products.length === 0 && (
						<tr>
							<td colSpan={4} className="px-3 py-6 text-center text-slate-400">
								Belum ada data produk untuk filter ini.
							</td>
						</tr>
					)}
					{products.map((p) => (
						<tr key={p.id} className="border-b border-slate-100 last:border-0">
							<td className="px-3 py-2.5">{p.rank}</td>
							<td className="px-3 py-2.5">{p.name}</td>
							<td className="px-3 py-2.5">{p.quantity}</td>
							<td className="px-3 py-2.5">{formatRupiah(p.revenue)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</section>
);

const StockTable = ({ stocks }) => (
	<section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<h2 className="text-base font-semibold text-slate-700">Detail Stok per Cabang</h2>
		<div className="mt-3 overflow-x-auto">
			<table className="w-full min-w-215 table-fixed text-left text-sm text-slate-600">
				<thead className="bg-slate-100 text-slate-700">
					<tr>
						<th className="w-[16%] rounded-l-lg px-3 py-2 font-medium">Cabang</th>
						<th className="w-[22%] px-3 py-2 font-medium">Produk</th>
						<th className="w-[12%] px-3 py-2 font-medium">SKU</th>
						<th className="w-[14%] px-3 py-2 font-medium">Kategori</th>
						<th className="w-[12%] px-3 py-2 font-medium">Stok</th>
						<th className="w-[12%] px-3 py-2 font-medium">Min. Stok</th>
						<th className="w-[12%] rounded-r-lg px-3 py-2 font-medium">Status</th>
					</tr>
				</thead>
				<tbody>
					{stocks.length === 0 && (
						<tr>
							<td colSpan={7} className="px-3 py-6 text-center text-slate-400">
								Belum ada data stok untuk filter ini.
							</td>
						</tr>
					)}
					{stocks.map((s) => (
						<tr key={s.id} className="border-b border-slate-100 last:border-0">
							<td className="px-3 py-2.5">{s.outlet}</td>
							<td className="px-3 py-2.5">{s.product}</td>
							<td className="px-3 py-2.5">{s.sku}</td>
							<td className="px-3 py-2.5">{s.category}</td>
							<td className="px-3 py-2.5">{s.quantity ?? "-"}</td>
							<td className="px-3 py-2.5">{s.minQuantity}</td>
							<td className="px-3 py-2.5">
								<span className={`rounded-md px-2 py-1 text-xs font-medium ${s.status.className}`}>
									{s.status.label}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</section>
);

export default LaporanSuperAdmin;