import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiDollarSign, FiPackage, FiSearch, FiUsers } from "react-icons/fi";
import {
	Line,
	LineChart,
	Bar,
	BarChart,
	Pie,
	PieChart,
	Cell,
	Tooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";
import { getDasboard } from "../../../../services/Admin/dasboard.service"; 
import { getBisnis } from "../../../../services/SuperAdmin/manajementbisnis.service"; 

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

const formatRupiahShort = (value) => {
	const num = Number(value ?? 0);
	if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}jt`;
	if (num >= 1_000) return `${(num / 1_000).toFixed(1)}rb`;
	return `${num}`;
};

const formatShortDate = (isoOrLabel) => {
	const date = new Date(isoOrLabel);
	if (isNaN(date.getTime())) return isoOrLabel; // sudah berupa label string, biarkan
	return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(date);
};

const DONUT_COLORS = ["#1c86ef", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

const normalizeSummary = (s = {}) => ({
	totalPenjualan: s.totalPenjualan30d ?? s.totalPenjualan ?? s.totalRevenue ?? 0,
	totalTransaksi: s.totalTransaksi30d ?? s.totalTransaksi ?? s.transactionCount ?? 0,
	cabangAktif: s.cabangAktif ?? s.activeOutlets ?? 0,
	cabangTotal: s.cabangTotal ?? s.totalOutlets ?? 0,
	kasirAktif: s.kasirAktif ?? s.activeCashiers ?? s.kasirTerdaftar ?? 0,
	produkAktif: s.produkAktif ?? s.activeProducts ?? 0,
	produkTotal: s.produkTotal ?? s.totalProducts ?? 0,
});

const normalizeTrend = (list = []) =>
	list.map((item) => ({
		label: formatShortDate(item.date ?? item.tanggal ?? item.label),
		value: item.total ?? item.revenue ?? item.amount ?? 0,
	}));

const normalizePerCabang = (list = []) =>
	list.map((item) => ({
		name: item.outletName ?? "-",
		value: item.totalAmount ?? 0,
	}));

const normalizeTopProduk = (list = []) =>
	list.slice(0, 5).map((item, idx) => ({
		name: item.name ?? "-",
		revenue: item.totalAmount ?? 0,
		quantity: item.quantitySold ?? 0,
		percentage: item.percentage ?? 0,
		color: DONUT_COLORS[idx % DONUT_COLORS.length],
	}));

const normalizeStatusCabang = (list = []) =>
	list.map((item) => ({
		id: item.outletId,
		name: item.outletName ?? "-",
		transactionCount: item.transactionToday ?? 0,
		status: item.status ?? "ACTIVE",
	}));

const SummaryCard = ({ label, value, detail, icon: Icon, featured = false }) => (
	<article
		className={`rounded-xl border p-4 shadow-sm ${
			featured ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-800"
		}`}
	>
		<div className="mb-3 flex items-start justify-between gap-2">
			<h2 className={`text-sm font-medium ${featured ? "text-blue-100" : "text-slate-600"}`}>{label}</h2>
			<span
				className={`flex h-8 w-8 items-center justify-center rounded-lg ${
					featured ? "bg-blue-500 text-white" : "border border-slate-200 bg-slate-50 text-slate-500"
				}`}
			>
				<Icon size={15} />
			</span>
		</div>
		<p className="text-2xl font-bold leading-none">{value}</p>
		<p className={`mt-2 text-xs ${featured ? "text-blue-100" : "text-slate-400"}`}>{detail}</p>
	</article>
);

const TrendChart = ({ data }) => (
	<section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<h2 className="mb-3 text-base font-semibold text-slate-700">Tren Penjualan 7 Hari Terakhir</h2>
		{data.length === 0 ? (
			<p className="py-16 text-center text-sm text-slate-400">Belum ada data tren penjualan.</p>
		) : (
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
						<XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
						<YAxis
							tickFormatter={formatRupiahShort}
							tick={{ fontSize: 11, fill: "#94a3b8" }}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip formatter={(value) => formatRupiah(value)} labelFormatter={(label) => label} />
						<Line type="monotone" dataKey="value" stroke="#1c86ef" strokeWidth={2.5} dot={{ r: 3 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		)}
	</section>
);

const PerCabangChart = ({ data }) => (
	<section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<h2 className="mb-3 text-base font-semibold text-slate-700">Penjualan per Cabang</h2>
		{data.length === 0 ? (
			<p className="py-16 text-center text-sm text-slate-400">Belum ada data penjualan per cabang.</p>
		) : (
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
						<XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
						<YAxis
							tickFormatter={formatRupiahShort}
							tick={{ fontSize: 11, fill: "#94a3b8" }}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip formatter={(value) => formatRupiah(value)} />
						<Bar dataKey="value" fill="#1c86ef" radius={[6, 6, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		)}
	</section>
);

const TopProdukChart = ({ data }) => (
	<section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<h2 className="mb-3 text-base font-semibold text-slate-700">Top 5 Produk Terlaris</h2>
		{data.length === 0 ? (
			<p className="py-16 text-center text-sm text-slate-400">Belum ada data produk terlaris.</p>
		) : (
			<>
				<div className="h-52">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie data={data} dataKey="revenue" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
								{data.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
							<Tooltip formatter={(value) => formatRupiah(value)} />
						</PieChart>
					</ResponsiveContainer>
				</div>
				<ul className="mt-3 space-y-2">
					{data.map((item) => (
						<li key={item.name} className="flex items-center justify-between text-sm">
							<span className="flex items-center gap-2 text-slate-600">
								<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
								{item.name}
							</span>
							<span className="text-right">
								<span className="block font-medium text-slate-700">{formatRupiah(item.revenue)}</span>
								<span className="block text-xs text-slate-400">{item.quantity} terjual</span>
							</span>
						</li>
					))}
				</ul>
			</>
		)}
	</section>
);

const StatusCabang = ({ data }) => (
	<section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<h2 className="mb-3 text-base font-semibold text-slate-700">Status Cabang</h2>
		{data.length === 0 ? (
			<p className="py-10 text-center text-sm text-slate-400">Belum ada data cabang.</p>
		) : (
			<ul className="space-y-3">
				{data.map((outlet) => (
					<li key={outlet.id} className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2.5">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c86ef]/10 text-[#1c86ef]">
								<FiBriefcase size={15} />
							</span>
							<div>
								<p className="text-sm font-medium text-slate-700">{outlet.name}</p>
								<p className="text-xs text-slate-400">{outlet.transactionCount} transaksi</p>
							</div>
						</div>
						<span
							className={`rounded-md px-2 py-1 text-xs font-medium ${
								outlet.status === "ACTIVE" ? "bg-[#1c86ef] text-white" : "bg-slate-300 text-slate-700"
							}`}
						>
							{outlet.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
						</span>
					</li>
				))}
			</ul>
		)}
	</section>
);

const DashboardSuperAdmin = () => {
	const [businessOptions, setBusinessOptions] = useState([]);
	const [businessSearch, setBusinessSearch] = useState("");
	const [businessId, setBusinessId] = useState("");

	const [dashboard, setDashboard] = useState({
		summary: {},
		trend: [],
		perCabang: [],
		topProduk: [],
		statusCabang: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");


	useEffect(() => {
		getBisnis()
			.then((res) => {
				const list = res?.data?.data ?? [];
				const map = new Map();
				list.forEach((o) => {
					if (o.businessId && !map.has(o.businessId)) {
						map.set(o.businessId, { id: o.businessId, name: o.business?.name ?? o.businessId });
					}
				});
				const options = Array.from(map.values());
				setBusinessOptions(options);
				if (options.length > 0) setBusinessId(options[0].id);
			})
			.catch(() => {
				// Gagal ambil daftar bisnis tidak fatal; dropdown cukup kosong.
			});
	}, []);

	const filteredBusinessOptions = useMemo(() => {
		const term = businessSearch.trim().toLowerCase();
		if (!term) return businessOptions;
		return businessOptions.filter((b) => b.name?.toLowerCase().includes(term));
	}, [businessOptions, businessSearch]);

	useEffect(() => {
		if (!businessId) {
			setLoading(false);
			return;
		}

		let active = true;
		setLoading(true);
		setError("");

		getDasboard({ businessId })
	.then((response) => {
		if (!active) return;
		const data = response?.data?.data ?? response?.data ?? {};
		setDashboard({
			summary: normalizeSummary(data.summary),
			trend: normalizeTrend(data.trend),
			perCabang: normalizePerCabang(data.perOutlet),
			topProduk: normalizeTopProduk(data.topProducts),
			statusCabang: normalizeStatusCabang(data.outletStatus),
		});
	})
	.catch((err) => {
		if (active) setError(err.message || "Gagal mengambil data dashboard.");
	})
	.finally(() => {
		if (active) setLoading(false);
	});

		return () => {
			active = false;
		};
	}, [businessId]);

	const selectedBusinessName = businessOptions.find((b) => b.id === businessId)?.name ?? "Pilih Bisnis";

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">

			<div className="mt-5 grid gap-3 md:grid-cols-[1.5fr_1fr]">
				<label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400">
					<FiSearch size={16} />
					<input
						className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
						placeholder="Cari informasi bisnis..."
						value={businessSearch}
						onChange={(e) => setBusinessSearch(e.target.value)}
					/>
				</label>
				<select
					className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
					value={businessId}
					onChange={(e) => setBusinessId(e.target.value)}
				>
					{businessOptions.length === 0 && <option value="">Tidak ada bisnis</option>}
					{filteredBusinessOptions.map((b) => (
						<option key={b.id} value={b.id}>
							Bisnis {b.name}
						</option>
					))}
				</select>
			</div>

			{loading && <p className="mt-5 text-sm text-slate-500">Memuat dashboard...</p>}
			{!loading && error && (
				<p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
			)}

			{!loading && !error && (
				<div className="mt-5 space-y-5">
					<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<SummaryCard
							featured
							label="Total Penjualan (30 Hari)"
							value={formatRupiah(dashboard.summary.totalPenjualan)}
							detail={`Dari ${dashboard.summary.totalTransaksi} transaksi`}
							icon={FiDollarSign}
						/>
						<SummaryCard
							label="Cabang Aktif"
							value={dashboard.summary.cabangAktif}
							detail={`dari ${dashboard.summary.cabangTotal} total`}
							icon={FiBriefcase}
						/>
						<SummaryCard
							label="Kasir Aktif"
							value={dashboard.summary.kasirAktif}
							detail="Kasir terdaftar"
							icon={FiUsers}
						/>
						<SummaryCard
							label="Produk Aktif"
							value={dashboard.summary.produkAktif}
							detail={`dari ${dashboard.summary.produkTotal} total`}
							icon={FiPackage}
						/>
					</section>

					<section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
						<TrendChart data={dashboard.trend} />
						<PerCabangChart data={dashboard.perCabang} />
					</section>

					<section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
						<TopProdukChart data={dashboard.topProduk} />
						<StatusCabang data={dashboard.statusCabang} />
					</section>
				</div>
			)}
		</main>
	);
};

export default DashboardSuperAdmin;