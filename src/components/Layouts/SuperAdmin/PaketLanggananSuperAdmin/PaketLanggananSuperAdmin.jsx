import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiEdit2, FiEye, FiLoader, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { getLangganan, deleteLangganan } from "../../../../services/SuperAdmin/paketlangganan.service";
import PaketFormModal from "../../../fragments/SuperAdmin/PaketFormModal";

const customers = [
	{ business: "Cafe Kita", owner: "Rina", plan: "Pro", expired: "12 Aug" },
];

const branches = [
	{ business: "Cafe Kita", used: 3, total: 5, remaining: 2, plan: "Pro" },
];

const formatRupiah = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value || 0);

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
	<article className="w-full max-w-75 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm">
		<div className="flex items-start justify-between gap-3">
			<h2 className="text-base font-semibold text-slate-800">{plan.name}</h2>
			<span className={`rounded-md px-2 py-1 text-xs font-medium ${plan.isActive ? "bg-[#1c86ef] text-white" : "bg-slate-300 text-slate-700"}`}>
				{plan.isActive ? "Aktif" : "Nonaktif"}
			</span>
		</div>
		<p className="mt-2 min-h-10 text-xs leading-4 text-slate-500">{plan.description}</p>
		<p className="mt-5 text-xl font-semibold text-[#1c86ef]">{plan.priceDisplay}</p>
		<p className="text-xs text-slate-400">{plan.period}</p>
		<p className="mt-5 text-xs text-slate-600">Fitur:</p>
		<ul className="mt-1 space-y-1 text-xs text-slate-600">
			<li className="flex items-center gap-1.5">
				<FiCheck className="text-[#1c86ef]" size={14} />
				Maks {plan.maxBranches} Cabang
			</li>
			<li className="flex items-center gap-1.5">
				<FiCheck className="text-[#1c86ef]" size={14} />
				Maks {plan.maxKasir} Kasir
			</li>
			{plan.features.map((feature) => (
				<li key={feature} className="flex items-center gap-1.5">
					<FiCheck className="text-[#1c86ef]" size={14} />
					{feature}
				</li>
			))}
		</ul>
		<p className="mt-4 text-xs text-slate-500">Digunakan oleh:</p>
		<span className="mt-1 inline-block rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
			{plan.businesses}
		</span>
		<div className="mt-4 flex items-center gap-2 border-t border-slate-300 pt-3">
			<button
				type="button"
				onClick={() => onEdit(plan)}
				className="flex h-8 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-100"
			>
				<FiEdit2 size={15} />
				Edit
			</button>
			<button
				type="button"
				aria-label={`Hapus ${plan.name}`}
				onClick={() => onDelete(plan)}
				className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-red-500 hover:bg-red-50"
			>
				<FiTrash2 size={15} />
			</button>
		</div>
	</article>
);

const StatusBadge = () => <span className="rounded-md bg-[#1c86ef] px-2 py-1 text-xs font-medium text-white">Aktif</span>;
const ViewButton = ({ label }) => (
	<button type="button" aria-label={`Lihat ${label}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100">
		<FiEye size={16} />
	</button>
);

const SubscribersTable = () => (
	<section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
		<div className="grid gap-2 md:grid-cols-[1.5fr_1fr_1fr]">
			<FilterField placeholder="Cari bisnis..." />
			<FilterField placeholder="Semua Cabang" options={[]} />
			<FilterField placeholder="Aktif" options={[]} />
		</div>
		<div className="mt-3 overflow-x-auto">
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
					{customers.map((customer) => (
						<tr key={customer.business} className="border-b border-slate-100 last:border-0">
							<td className="px-3 py-3">{customer.business}</td>
							<td className="px-3 py-3">{customer.owner}</td>
							<td className="px-3 py-3">{customer.plan}</td>
							<td className="px-3 py-3">
								<StatusBadge />
							</td>
							<td className="px-3 py-3">{customer.expired}</td>
							<td className="px-3 py-3">
								<ViewButton label={customer.business} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</section>
);

const BranchPlans = () => (
	<section className="mt-4">
		<div className="grid gap-2 md:grid-cols-[1.5fr_1fr]">
			<FilterField placeholder="Cari Bisnis..." />
			<FilterField placeholder="Filter Paket" options={[]} />
		</div>
		<div className="mt-4">
			<article className="w-full max-w-75 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-semibold text-slate-800">{branches[0].business}</h2>
					<span className="rounded-md bg-[#1c86ef] px-2 py-1 text-xs font-medium text-white">{branches[0].plan}</span>
				</div>
				<div className="mt-5 space-y-2 text-sm text-slate-500">
					<p className="flex justify-between">
						Cabang Digunakan{" "}
						<span>
							<b className="text-[#1c86ef]">{branches[0].used}</b> / {branches[0].total} Cabang
						</span>
					</p>
					<p className="flex justify-between">
						Sisa Cabang <b className="text-slate-700">{branches[0].remaining}</b>
					</p>
				</div>
				<button type="button" className="mt-5 h-9 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-100">
					Lihat Detail
				</button>
			</article>
		</div>
	</section>
);

const PaketLanggananSuperAdmin = () => {
	const [activeTab, setActiveTab] = useState("plans");
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [search, setSearch] = useState("");
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
		const term = search.trim().toLowerCase();
		return plans.filter((p) => {
			const matchesSearch = !term || p.name?.toLowerCase().includes(term);
			const matchesCycle = !cycleFilter || p.billingCycle === cycleFilter;
			const matchesStatus =
				!statusFilter ||
				(statusFilter === "Aktif" ? p.isActive : !p.isActive);
			return matchesSearch && matchesCycle && matchesStatus;
		});
	}, [plans, search, cycleFilter, statusFilter]);

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
		<main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Manajemen Langganan - Semua Cabang</h1>
					<p className="mt-1 text-sm text-slate-500">Kelola paket langganan untuk semua cabang</p>
				</div>
				<button
					type="button"
					onClick={() => setFormModal({ mode: "create" })}
					className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]"
				>
					<FiPlus size={17} />
					Tambah Paket
				</button>
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
						<FilterField placeholder="Cari paket..." value={search} onChange={setSearch} />
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