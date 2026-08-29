import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiEdit2, FiEye, FiHome, FiLoader, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import {
	getLangganan,
	deleteLangganan,
	getSubscriptions,
	getSubscriptionsPerCabang,
} from "../../../../services/SuperAdmin/paketlangganan.service";
import PaketFormModal from "../../../fragments/SuperAdmin/PaketFormModal";

const formatRupiah = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value || 0);

const formatDate = (isoString) => {
	if (!isoString) return "-";
	return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(
		new Date(isoString)
	);
};

const periodLabel = (cycle) => {
	const normalized = (cycle || "").toUpperCase();
	if (normalized === "MONTHLY") return "/Bulan";
	if (normalized === "YEARLY" || normalized === "ANNUAL") return "/Tahun";
	return cycle ? `/${cycle}` : "";
};

// Normalisasi 1 item dari response getLangganan (data[])
const normalizePlan = (item) => ({
	id: item.id,
	name: item.name,
	description: item.description,
	price: item.price,
	priceDisplay: formatRupiah(item.price),
	period: periodLabel(item.billingCycle),
	billingCycle: item.billingCycle,
	maxBranches: item.maxBranches,
	maxKasir: item.maxKasir,
	isActive: item.isActive,
	features: (item.features || []).map((f) => f.name),
	businesses: `${item.activeBusinessCount ?? 0} Bisnis`,
});

const extractList = (res) => {
	if (Array.isArray(res?.data)) return res.data;
	if (Array.isArray(res?.data?.data)) return res.data.data;
	return [];
};

const extractMeta = (res, list) => res?.meta ?? res?.data?.meta ?? { total: list.length, page: 1, limit: 10 };

// Normalisasi 1 item dari GET /superadmin/subscriptions
const normalizeSubscription = (item) => ({
	businessId: item.businessId,
	businessName: item.businessName,
	ownerName: item.ownerName,
	packageName: item.packageName,
	status: item.status,
	expiredAt: item.expiredAt,
	expiredDisplay: formatDate(item.expiredAt),
});

// Normalisasi 1 item dari GET /superadmin/subscriptions/per-cabang
const normalizeBranchPlan = (item) => ({
	businessId: item.businessId,
	businessName: item.businessName,
	packageName: item.packageName,
	maxOutlets: item.maxOutlets,
	usedOutlets: item.usedOutlets,
	remainingOutlets: item.remainingOutlets,
});

const TabButton = ({ active, children, onClick }) => (
	<button type="button" role="tab" aria-selected={active} onClick={onClick} className={`rounded-md px-3 py-1.5 text-sm font-medium ${active ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}`}>
		{children}
	</button>
);

const FilterField = ({ placeholder, options, value, onChange }) =>
	options ? (
		<select
			className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
			value={value ?? ""}
			onChange={(e) => onChange?.(e.target.value)}
		>
			<option value="">{placeholder}</option>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
	) : (
		<label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
			<FiSearch size={16} />
			<input
				className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
				placeholder={placeholder}
				value={value ?? ""}
				onChange={(e) => onChange?.(e.target.value)}
			/>
		</label>
	);

const PlanCard = ({ plan, onEdit, onDelete }) => (
	<article className="w-full max-w-100 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<div className="flex items-start justify-between gap-3">
			<h2 className="text-xl font-semibold text-slate-800">{plan.name}</h2>
			<span className={`rounded-md px-2.5 py-1 text-sm font-medium ${plan.isActive ? "bg-[#1c86ef] text-white" : "bg-slate-300 text-slate-700"}`}>
				{plan.isActive ? "Aktif" : "Nonaktif"}
			</span>
		</div>
		<p className="mt-2 min-h-11 text-sm leading-5 text-slate-500">{plan.description}</p>
		<p className="mt-6 text-3xl font-semibold text-[#1c86ef]">{plan.priceDisplay}</p>
		<p className="text-sm text-slate-400">{plan.period}</p>
		<p className="mt-6 text-sm text-slate-600">Fitur:</p>
		<ul className="mt-2 space-y-2 text-sm text-slate-600">
			<li className="flex items-center gap-2">
				<FiCheck className="text-[#1c86ef]" size={16} />
				Maks {plan.maxBranches} Cabang
			</li>
			<li className="flex items-center gap-2">
				<FiCheck className="text-[#1c86ef]" size={16} />
				Maks {plan.maxKasir} Kasir
			</li>
			{plan.features.map((feature) => (
				<li key={feature} className="flex items-center gap-2">
					<FiCheck className="text-[#1c86ef]" size={16} />
					{feature}
				</li>
			))}
		</ul>
		<p className="mt-5 text-sm text-slate-500">Digunakan oleh:</p>
		<span className="mt-1.5 inline-block rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-500">
			{plan.businesses}
		</span>
		<div className="mt-5 flex items-center gap-3 border-t border-slate-300 pt-4">
			<button
				type="button"
				onClick={() => onEdit(plan)}
				className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100"
			>
				<FiEdit2 size={16} />
				Edit
			</button>
			<button
				type="button"
				aria-label={`Hapus ${plan.name}`}
				onClick={() => onDelete(plan)}
				className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-red-500 hover:bg-red-50"
			>
				<FiTrash2 size={16} />
			</button>
		</div>
	</article>
);

const StatusBadge = ({ status }) => {
	const normalized = (status || "").toUpperCase();
	const isActive = normalized === "ACTIVE";
	return (
		<span className={`rounded-md px-2 py-1 text-xs font-medium ${isActive ? "bg-[#1c86ef] text-white" : "bg-slate-300 text-slate-700"}`}>
			{isActive ? "Aktif" : status || "-"}
		</span>
	);
};

const ViewButton = ({ label, onClick }) => (
	<button
		type="button"
		aria-label={`Lihat ${label}`}
		onClick={onClick}
		className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
	>
		<FiEye size={16} />
	</button>
);

const SubscriptionDetailModal = ({ subscription, onClose, onToggleStatus }) => {
	if (!subscription) return null;

	const nextStatus = subscription.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
			<div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Detail Pelanggan Aktif</p>
						<h3 className="mt-2 text-2xl font-bold text-slate-800">{subscription.businessName}</h3>
					</div>
					<StatusBadge status={subscription.status} />
				</div>

				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<DetailInfo label="Owner" value={subscription.ownerName} />
					<DetailInfo label="Paket" value={subscription.packageName} />
					<DetailInfo label="Status Langganan" value={subscription.status === "ACTIVE" ? "Aktif" : subscription.status || "-"} />
					<DetailInfo label="Berlaku Hingga" value={subscription.expiredDisplay || "-"} />
				</div>

				<div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
					<button
						type="button"
						onClick={() => onToggleStatus(subscription)}
						className="rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1779dc]"
					>
						{nextStatus}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
};

const DetailInfo = ({ label, value }) => (
	<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
		<p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
		<p className="mt-2 text-sm font-medium text-slate-700">{value || "-"}</p>
	</div>
);

const SubscribersTable = () => {
	const [subscriptions, setSubscriptions] = useState([]);
	const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [selectedSubscription, setSelectedSubscription] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		getSubscriptions({ page, limit: 10 })
			.then((res) => {
				const list = extractList(res);
				const nextSubscriptions = list.map(normalizeSubscription);
				setSubscriptions(nextSubscriptions);
				setMeta(extractMeta(res, list));
			})
			.catch((err) => setError(err.message || "Gagal mengambil daftar pelanggan aktif"))
			.finally(() => setLoading(false));
	}, [page]);

	const handleToggleStatus = (subscription) => {
		setSubscriptions((prev) =>
			prev.map((item) =>
				item.businessId === subscription.businessId
					? { ...item, status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
					: item
			)
		);
		setSelectedSubscription((prev) =>
			prev && prev.businessId === subscription.businessId
				? { ...prev, status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
				: prev
		);
	};

	const totalPages = Math.max(1, Math.ceil((meta.total ?? 0) / (meta.limit ?? 10)));

	return (
		<>
			<section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
				<h2 className="mb-3 text-base font-semibold text-slate-700">Pelanggan Berlangganan</h2>

				{loading && (
					<div className="flex items-center justify-center gap-2 py-6 text-slate-400">
						<FiLoader className="animate-spin" size={18} />
						<span className="text-sm">Memuat daftar pelanggan...</span>
					</div>
				)}

				{!loading && error && <div className="py-6 text-center text-sm text-red-500">{error}</div>}

				{!loading && !error && (
					<div className="overflow-x-auto">
						<table className="w-full min-w-175 table-fixed text-left text-sm text-slate-600">
							<thead className="bg-slate-100 text-slate-700">
								<tr>
									<th className="w-[20%] px-3 py-2 font-medium">Bisnis</th>
									<th className="w-[20%] px-3 py-2 font-medium">Owner</th>
									<th className="w-[20%] px-3 py-2 font-medium">Paket</th>
									<th className="w-[20%] px-3 py-2 font-medium">Status</th>
									<th className="w-[15%] px-3 py-2 font-medium">Expired</th>
									<th className="w-[5%] px-3 py-2 font-medium">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{subscriptions.length === 0 && (
									<tr>
										<td colSpan={6} className="px-3 py-6 text-center text-slate-400">
											Belum ada pelanggan aktif.
										</td>
									</tr>
								)}
								{subscriptions.map((sub) => (
									<tr key={sub.businessId} className="border-b border-slate-100 last:border-0">
										<td className="px-3 py-3 text-slate-700">{sub.businessName}</td>
										<td className="px-3 py-3">{sub.ownerName}</td>
										<td className="px-3 py-3">{sub.packageName}</td>
										<td className="px-3 py-3"><StatusBadge status={sub.status} /></td>
										<td className="px-3 py-3">{sub.expiredDisplay}</td>
										<td className="px-3 py-3">
											<ViewButton label={sub.businessName} onClick={() => setSelectedSubscription(sub)} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!loading && !error && meta.total > meta.limit && (
					<div className="mt-3 flex items-center justify-between px-1 text-sm text-slate-500">
						<span>
							Halaman {meta.page} dari {totalPages} ({meta.total} pelanggan)
						</span>
						<div className="flex items-center gap-2">
							<button
								type="button"
								disabled={page <= 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 disabled:opacity-40"
							>
								Sebelumnya
							</button>
							<button
								type="button"
								disabled={page >= totalPages}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 disabled:opacity-40"
							>
								Berikutnya
							</button>
						</div>
					</div>
				)}
			</section>

			{selectedSubscription && (
				<SubscriptionDetailModal
					subscription={selectedSubscription}
					onClose={() => setSelectedSubscription(null)}
					onToggleStatus={handleToggleStatus}
				/>
			)}
		</>
	);
};

const BranchPlanCard = ({ branch, onViewDetail }) => (
	<article className="w-full max-w-75 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c86ef]/10 text-[#1c86ef]">
					<FiHome size={16} />
				</span>
				<h2 className="text-base font-semibold text-slate-800">{branch.businessName}</h2>
			</div>
			<span className="rounded-md bg-[#1c86ef] px-2 py-1 text-xs font-medium text-white">{branch.packageName}</span>
		</div>
		<div className="mt-5 space-y-2 text-sm text-slate-500">
			<p className="flex justify-between">
				Cabang Digunakan{" "}
				<span>
					<b className="text-[#1c86ef]">{branch.usedOutlets}</b> / {branch.maxOutlets} Cabang
				</span>
			</p>
			<p className="flex justify-between">
				Sisa Cabang <b className="text-slate-700">{branch.remainingOutlets}</b>
			</p>
		</div>
		<button
			type="button"
			onClick={() => onViewDetail(branch)}
			className="mt-5 h-9 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-100"
		>
			Lihat Detail
		</button>
	</article>
);

const BranchDetailModal = ({ branch, onClose }) => {
	if (!branch) return null;

	const usagePercent = branch.maxOutlets
		? Math.min(100, Math.round((branch.usedOutlets / branch.maxOutlets) * 100))
		: 0;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
			<div
				className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2.5">
						<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1c86ef]/10 text-[#1c86ef]">
							<FiHome size={18} />
						</span>
						<div>
							<h2 className="text-lg font-semibold text-slate-800">{branch.businessName}</h2>
							<span className="mt-0.5 inline-block rounded-md bg-[#1c86ef] px-2 py-0.5 text-xs font-medium text-white">
								Paket {branch.packageName}
							</span>
						</div>
					</div>
					<button
						type="button"
						aria-label="Tutup"
						onClick={onClose}
						className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
					>
						<FiX size={20} />
					</button>
				</div>

				<div className="mt-6 space-y-4">
					<div>
						<div className="flex items-center justify-between text-sm text-slate-600">
							<span>Cabang Digunakan</span>
							<span>
								<b className="text-[#1c86ef]">{branch.usedOutlets}</b> / {branch.maxOutlets} Cabang
							</span>
						</div>
						<div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
							<div
								className="h-full rounded-full bg-[#1c86ef]"
								style={{ width: `${usagePercent}%` }}
							/>
						</div>
						<p className="mt-1 text-right text-xs text-slate-400">{usagePercent}% terpakai</p>
					</div>

					<div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f8fafc] p-4 text-sm">
						<div>
							<p className="text-slate-500">Sisa Cabang</p>
							<p className="mt-1 text-xl font-semibold text-slate-800">{branch.remainingOutlets}</p>
						</div>
						<div>
							<p className="text-slate-500">Maks Cabang</p>
							<p className="mt-1 text-xl font-semibold text-slate-800">{branch.maxOutlets}</p>
						</div>
					</div>
				</div>

				<div className="mt-6 border-t border-slate-200 pt-4">
					<button
						type="button"
						onClick={onClose}
						className="h-10 w-full rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
};

const BranchPlans = () => {
	const [branches, setBranches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState("");
	const [packageFilter, setPackageFilter] = useState("");
	const [detailBranch, setDetailBranch] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		getSubscriptionsPerCabang({ search })
			.then((res) => {
				const list = extractList(res);
				setBranches(list.map(normalizeBranchPlan));
			})
			.catch((err) => setError(err.message || "Gagal mengambil data langganan per cabang"))
			.finally(() => setLoading(false));
	}, [search]);

	const packageOptions = useMemo(
		() => Array.from(new Set(branches.map((b) => b.packageName).filter(Boolean))),
		[branches]
	);

	const filteredBranches = useMemo(() => {
		if (!packageFilter) return branches;
		return branches.filter((b) => b.packageName === packageFilter);
	}, [branches, packageFilter]);

	return (
		<section className="mt-4">
			<div className="grid gap-2 md:grid-cols-[1.5fr_1fr]">
				<FilterField placeholder="Cari Bisnis..." value={search} onChange={setSearch} />
				<FilterField placeholder="Filter Paket" options={packageOptions} value={packageFilter} onChange={setPackageFilter} />
			</div>

			{loading && (
				<div className="mt-6 flex items-center justify-center gap-2 py-6 text-slate-400">
					<FiLoader className="animate-spin" size={18} />
					<span className="text-sm">Memuat data cabang...</span>
				</div>
			)}

			{!loading && error && <div className="mt-6 text-center text-sm text-red-500">{error}</div>}

			{!loading && !error && filteredBranches.length === 0 && (
				<div className="mt-6 text-center text-sm text-slate-400">Tidak ada bisnis yang cocok.</div>
			)}

			{!loading && !error && filteredBranches.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-4">
					{filteredBranches.map((branch) => (
						<BranchPlanCard key={branch.businessId} branch={branch} onViewDetail={setDetailBranch} />
					))}
				</div>
			)}

			{detailBranch && <BranchDetailModal branch={detailBranch} onClose={() => setDetailBranch(null)} />}
		</section>
	);
};

const PaketLanggananSuperAdmin = () => {
	const [activeTab, setActiveTab] = useState("plans");
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [planSearch, setPlanSearch] = useState("");
	const [cycleFilter, setCycleFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	const [formModal, setFormModal] = useState(null); // { mode: "create" | "edit", data?: plan }

	const loadPlans = () => {
		setLoading(true);
		setError(null);
		getLangganan()
			.then((res) => {
				const list = res?.data ?? [];
				setPlans(list.map(normalizePlan));
			})
			.catch((err) => setError(err.message || "Gagal mengambil daftar paket"))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadPlans();
	}, []);

	const cycleOptions = useMemo(
		() => Array.from(new Set(plans.map((p) => p.billingCycle).filter(Boolean))),
		[plans]
	);

	const filteredPlans = useMemo(() => {
		const term = planSearch.trim().toLowerCase();
		return plans.filter((p) => {
			const matchesSearch = !term || p.name?.toLowerCase().includes(term);
			const matchesCycle = !cycleFilter || p.billingCycle === cycleFilter;
			const matchesStatus =
				!statusFilter ||
				(statusFilter === "Aktif" ? p.isActive : !p.isActive);
			return matchesSearch && matchesCycle && matchesStatus;
		});
	}, [plans, planSearch, cycleFilter, statusFilter]);

	const handleDelete = async (plan) => {
		if (!window.confirm(`Hapus paket "${plan.name}"?`)) return;
		try {
			await deleteLangganan(plan.id);
			setPlans((prev) => prev.filter((p) => p.id !== plan.id));
		} catch (err) {
			alert(err.message || "Gagal menghapus paket");
		}
	};

	const handleFormSuccess = () => {
		setFormModal(null);
		loadPlans();
	};

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
		<header className="mb-5 flex flex-wrap items-start justify-between gap-4">
	<div>
		<h1 className="text-[2.1rem] font-bold tracking-tight text-slate-800">Manajemen Langganan - Semua Cabang</h1>
		<p className="mt-1 text-sm text-slate-500">Kelola paket langganan untuk semua cabang</p>
	</div>
	{activeTab === "plans" && (
		<button
			type="button"
			onClick={() => setFormModal({ mode: "create" })}
			className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]"
		>
			<FiPlus size={17} />
			Tambah Paket
		</button>
	)}
</header>

			<div className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1" role="tablist" aria-label="Jenis data langganan">
				<TabButton active={activeTab === "plans"} onClick={() => setActiveTab("plans")}>
					Paket Langganan
				</TabButton>
				<TabButton active={activeTab === "customers"} onClick={() => setActiveTab("customers")}>
					Pelanggan Aktif
				</TabButton>
				<TabButton active={activeTab === "branches"} onClick={() => setActiveTab("branches")}>
					Per Cabang
				</TabButton>
			</div>

			{activeTab === "plans" && (
				<>
					<div className="mt-4 grid max-w-190 gap-2 md:grid-cols-[1.5fr_1fr_0.7fr_0.6fr]">
						<FilterField placeholder="Cari paket..." value={planSearch} onChange={setPlanSearch} />
						<FilterField placeholder="Semua Durasi" options={cycleOptions} value={cycleFilter} onChange={setCycleFilter} />
						<FilterField placeholder="Semua" options={["Aktif", "Nonaktif"]} value={statusFilter} onChange={setStatusFilter} />
						<span />
					</div>

					{loading && (
						<div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
							<FiLoader className="animate-spin" size={18} />
							<span className="text-sm">Memuat daftar paket...</span>
						</div>
					)}

					{!loading && error && <div className="mt-10 text-center text-sm text-red-500">{error}</div>}

					{!loading && !error && filteredPlans.length === 0 && (
						<div className="mt-10 text-center text-sm text-slate-400">Tidak ada paket yang cocok.</div>
					)}

					{!loading && !error && filteredPlans.length > 0 && (
						<section className="mt-4 flex flex-wrap gap-4">
							{filteredPlans.map((plan) => (
								<PlanCard
									key={plan.id}
									plan={plan}
									onEdit={(p) => setFormModal({ mode: "edit", data: p })}
									onDelete={handleDelete}
								/>
							))}
						</section>
					)}
				</>
			)}
			{activeTab === "customers" && <SubscribersTable />}
			{activeTab === "branches" && <BranchPlans />}

			{formModal && (
				<PaketFormModal
					mode={formModal.mode}
					initialData={formModal.data}
					onClose={() => setFormModal(null)}
					onSuccess={handleFormSuccess}
				/>
			)}
		</main>
	);
};

export default PaketLanggananSuperAdmin;