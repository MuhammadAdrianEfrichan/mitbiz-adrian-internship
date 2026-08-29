import { useEffect, useMemo, useState } from "react";
import {
	FiEdit2,
	FiEye,
	FiLoader,
	FiPlus,
	FiSearch,
	FiTrash2,
} from "react-icons/fi";
import { getUsers, deleteUsers } from "../../../../services/SuperAdmin/manajementuser.service";
import { getSubscriptions } from "../../../../services/SuperAdmin/paketlangganan.service";
import UserFormModal from "../../../fragments/SuperAdmin/UserFormModal";

const customers = [
	{ name: "Rudi Hartono", contact: "rudi.hartono@email.com", branch: "Cabang Jakarta Pusat", plan: "1 Paket" },
	{ name: "Rudi Hartono", contact: "rudi.hartono@email.com", branch: "Cabang Jakarta Pusat", plan: "1 Paket" },
];

const roleLabelFromRaw = (role) => {
	const normalized = (role || "").toUpperCase();
	if (normalized === "ADMIN") return "Admin";
	if (normalized === "STAFF") return "Staff";
	if (normalized === "OWNER") return "Owner";
	return role || "-";
};

// Normalisasi 1 item dari response getUsers (data.data.data[])
const normalizeUser = (u) => ({
	id: u.id,
	name: u.name,
	username: u.username || u.email || "-",
	role: u.role, // ADMIN / STAFF / OWNER (raw, untuk badge & filter ringkasan)
	roleLabel: u.customRole?.name || roleLabelFromRaw(u.role),
	status: u.status,
	businessId: u.businessId,
	businessName: u.business?.name,
	businessCode: u.business?.businessCode,
	outletId: u.outletId,
	branch: u.outlet?.name || "Semua Cabang",
	email: u.email,
	phone: u.phone,
});

const formatDate = (isoString) => {
	if (!isoString) return "-";
	return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(
		new Date(isoString)
	);
};

// Ambil array dari response yang bentuknya bisa { data: [...] } ATAU { data: { data: [...] } }
const extractList = (res) => {
	if (Array.isArray(res?.data)) return res.data;
	if (Array.isArray(res?.data?.data)) return res.data.data;
	return [];
};

const extractMeta = (res, list) => res?.meta ?? res?.data?.meta ?? { total: list.length, page: 1, limit: 10 };

// Normalisasi 1 item dari GET /superadmin/subscriptions — dipakai ulang untuk tab "Daftar Pelanggan"
const normalizeSubscriber = (item) => ({
	businessId: item.businessId,
	name: item.businessName ?? "-",
	contact: item.ownerName ?? "-", // tidak ada field kontak asli di endpoint ini, fallback ke nama owner
	branch: "-", // endpoint ini per-bisnis, bukan per-cabang, jadi belum ada datanya
	plan: item.packageName ?? "-",
	status: item.status,
	expiredAt: item.expiredAt,
	expiredDisplay: formatDate(item.expiredAt),
});

const SummaryCard = ({ label, value, detail }) => (
	<article className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm">
		<div className="flex items-start justify-between">
			<h2 className="text-base font-medium text-slate-700">{label}</h2>
			<span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400">◎</span>
		</div>
		<p className="mt-4 text-2xl font-semibold text-slate-800">{value}</p>
		<p className="mt-1 text-sm text-slate-400">{detail}</p>
	</article>
);

const StatusBadge = ({ status }) => {
	const normalized = (status || "").toUpperCase();
	const isActive = normalized === "ACTIVE";
	return (
		<span
			className={`rounded-md px-2 py-1 text-sm font-medium ${
				isActive ? "bg-[#1c86ef] text-white" : "bg-slate-300 text-slate-700"
			}`}
		>
			{isActive ? "Aktif" : "Nonaktif"}
		</span>
	);
};

const ActionButtons = ({ customer = false, label, onView, onEdit, onDelete }) => (
	<div className="flex items-center justify-center gap-2">
		<button
			type="button"
			aria-label={`${customer ? "Lihat" : "Edit"} ${label}`}
			onClick={customer ? onView : onEdit}
			className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
		>
			{customer ? <FiEye size={16} /> : <FiEdit2 size={16} />}
		</button>
		{!customer && (
			<button
				type="button"
				aria-label={`Hapus ${label}`}
				onClick={onDelete}
				className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-red-500 hover:bg-red-50"
			>
				<FiTrash2 size={16} />
			</button>
		)}
	</div>
);

const ManajementUserSuperAdmin = () => {
	const [activeTab, setActiveTab] = useState("users");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("");
	const [branchFilter, setBranchFilter] = useState("");

	const [formModal, setFormModal] = useState(null); // { mode: "create" | "edit", data?: user }

	const loadUsers = () => {
		setLoading(true);
		setError(null);
		getUsers()
			.then((res) => {
				const list = res?.data?.data ?? [];
				setUsers(list.map(normalizeUser));
			})
			.catch((err) => setError(err.message || "Gagal mengambil daftar user"))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const summary = useMemo(() => {
		const totalAdmin = users.filter((u) => (u.role || "").toUpperCase() === "ADMIN").length;
		const totalStaff = users.filter((u) => (u.role || "").toUpperCase() === "STAFF").length;
		return { totalAdmin, totalStaff, total: users.length };
	}, [users]);

	const roleOptions = useMemo(
		() => Array.from(new Set(users.map((u) => u.roleLabel).filter(Boolean))),
		[users]
	);
	const branchOptions = useMemo(
		() => Array.from(new Set(users.map((u) => u.branch).filter(Boolean))),
		[users]
	);

	// Daftar bisnis unik untuk dropdown "Bisnis" saat Tambah User
	const businessOptions = useMemo(() => {
		const map = new Map();
		users.forEach((u) => {
			if (u.businessId && !map.has(u.businessId)) {
				map.set(u.businessId, { id: u.businessId, name: u.businessName, businessCode: u.businessCode });
			}
		});
		return Array.from(map.values());
	}, [users]);

	// Daftar outlet unik per bisnis, di-derive dari data user yang sudah ada (pendekatan sementara)
	const outletsByBusiness = useMemo(() => {
		const map = {};
		users.forEach((u) => {
			if (!u.businessId || !u.outletId) return;
			if (!map[u.businessId]) map[u.businessId] = new Map();
			if (!map[u.businessId].has(u.outletId)) {
				map[u.businessId].set(u.outletId, { id: u.outletId, name: u.branch });
			}
		});
		return Object.fromEntries(
			Object.entries(map).map(([bizId, outletMap]) => [bizId, Array.from(outletMap.values())])
		);
	}, [users]);

	const filteredUsers = useMemo(() => {
		const term = search.trim().toLowerCase();
		return users.filter((u) => {
			const matchesSearch =
				!term ||
				u.name?.toLowerCase().includes(term) ||
				u.username?.toLowerCase().includes(term);
			const matchesRole = !roleFilter || u.roleLabel === roleFilter;
			const matchesBranch = !branchFilter || u.branch === branchFilter;
			return matchesSearch && matchesRole && matchesBranch;
		});
	}, [users, search, roleFilter, branchFilter]);

	const handleDeleteUser = async (user) => {
		if (!window.confirm(`Hapus user "${user.name}"?`)) return;
		try {
			await deleteUsers(user.id);
			setUsers((prev) => prev.filter((u) => u.id !== user.id));
		} catch (err) {
			alert(err.message || "Gagal menghapus user");
		}
	};

	const handleFormSuccess = () => {
		setFormModal(null);
		loadUsers();
	};

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
			<header className="mb-5 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-[2.1rem] font-bold tracking-tight text-slate-800">Manajemen User</h1>
					<p className="mt-1 text-sm text-slate-500">Kelola admin dan kasir di semua cabang</p>
				</div>
				<button
					type="button"
					onClick={() => setFormModal({ mode: "create" })}
					className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]"
				>
					<FiPlus size={17} />
					Tambah User
				</button>
			</header>

			<div className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1" role="tablist" aria-label="Jenis data user">
				<button type="button" role="tab" aria-selected={activeTab === "users"} onClick={() => setActiveTab("users")} className={`rounded-md px-3 py-1.5 text-sm font-medium ${activeTab === "users" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}`}>
					Ringkasan
				</button>
				<button type="button" role="tab" aria-selected={activeTab === "customers"} onClick={() => setActiveTab("customers")} className={`rounded-md px-3 py-1.5 text-sm font-medium ${activeTab === "customers" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}`}>
					Daftar Pelanggan
				</button>
			</div>

			{activeTab === "users" ? (
				<>
					<section className="mt-4 grid gap-4 md:grid-cols-3" aria-label="Ringkasan user">
						<SummaryCard label="Total Admin" value={summary.totalAdmin} detail="Aktif di semua cabang" />
						<SummaryCard label="Total Staff" value={summary.totalStaff} detail="Aktif di semua cabang" />
						<SummaryCard label="Total User" value={summary.total} detail="Dari semua role" />
					</section>

					{loading && (
						<div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
							<FiLoader className="animate-spin" size={18} />
							<span className="text-sm">Memuat daftar user...</span>
						</div>
					)}

					{!loading && error && (
						<div className="mt-8 text-center text-sm text-red-500">{error}</div>
					)}

					{!loading && !error && (
						<UserTable
							users={filteredUsers}
							search={search}
							onSearchChange={setSearch}
							roleFilter={roleFilter}
							onRoleFilterChange={setRoleFilter}
							branchFilter={branchFilter}
							onBranchFilterChange={setBranchFilter}
							roleOptions={roleOptions}
							branchOptions={branchOptions}
							onEdit={(u) => setFormModal({ mode: "edit", data: u })}
							onDelete={handleDeleteUser}
						/>
					)}
				</>
			) : (
				<CustomerTable />
			)}

			{formModal && (
				<UserFormModal
					mode={formModal.mode}
					initialData={formModal.data}
					businessOptions={businessOptions}
					outletsByBusiness={outletsByBusiness}
					onClose={() => setFormModal(null)}
					onSuccess={handleFormSuccess}
				/>
			)}
		</main>
	);
};

// Lebar kolom & padding disesuaikan supaya Username tidak mepet/nabrak Role.
// Username memakai truncate + title agar email/username panjang tidak meluber ke kolom sebelah.
const UserTable = ({
	users,
	search,
	onSearchChange,
	roleFilter,
	onRoleFilterChange,
	branchFilter,
	onBranchFilterChange,
	roleOptions,
	branchOptions,
	onEdit,
	onDelete,
}) => (
	<section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
		<FilterBar
			firstPlaceholder="Cari nama atau username..."
			searchValue={search}
			onSearchChange={onSearchChange}
			secondLabel="Semua role"
			secondValue={roleFilter}
			onSecondChange={onRoleFilterChange}
			secondOptions={roleOptions}
			thirdLabel="Semua cabang"
			thirdValue={branchFilter}
			onThirdChange={onBranchFilterChange}
			thirdOptions={branchOptions}
		/>
		<div className="overflow-x-auto">
			<table className="w-full min-w-215 table-fixed text-left text-sm text-slate-600">
				<thead className="bg-slate-100 text-slate-700">
					<tr>
						<th className="w-[15%] px-4 py-2.5 font-medium">Nama</th>
						<th className="w-[22%] px-4 py-2.5 font-medium">Username</th>
						<th className="w-[13%] px-4 py-2.5 font-medium">Role</th>
						<th className="w-[17%] px-4 py-2.5 font-medium">Cabang</th>
						<th className="w-[15%] px-4 py-2.5 font-medium">Bisnis</th>
						<th className="w-[10%] px-4 py-2.5 font-medium">Status</th>
						<th className="w-[8%] px-4 py-2.5 text-center font-medium">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{users.length === 0 && (
						<tr>
							<td colSpan={7} className="px-4 py-8 text-center text-slate-400">
								Tidak ada user yang cocok.
							</td>
						</tr>
					)}
					{users.map((user) => (
						<tr key={user.id} className="border-b border-slate-100 last:border-0">
							<td className="px-4 py-3">{user.name}</td>
							<td className="truncate px-4 py-3" title={user.username}>
								{user.username}
							</td>
							<td className="px-4 py-3">
								<span
									className={
										user.role === "ADMIN"
											? "inline-block rounded bg-blue-600 px-2 py-1 text-white"
											: "inline-block rounded border border-slate-300 px-2 py-1"
									}
								>
									{user.roleLabel}
								</span>
							</td>
							<td className="px-4 py-3">{user.branch}</td>
							<td className="truncate px-4 py-3 text-slate-500" title={`${user.businessName} · ${user.businessCode}`}>
								{user.businessName}
								{user.businessCode ? ` · ${user.businessCode}` : ""}
							</td>
							<td className="px-4 py-3">
								<StatusBadge status={user.status} />
							</td>
							<td className="px-4 py-3">
								<ActionButtons label={user.name} onEdit={() => onEdit(user)} onDelete={() => onDelete(user)} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</section>
);

const CustomerDetailCard = ({ customer, onClose, onToggleStatus }) => {
	if (!customer) return null;

	const nextStatus = customer.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
			<div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Detail Pelanggan</p>
						<h3 className="mt-2 text-2xl font-bold text-slate-800">{customer.name}</h3>
					</div>
					<StatusBadge status={customer.status} />
				</div>

				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<DetailInfo label="Bisnis" value={customer.name} />
					<DetailInfo label="Pemilik / Kontak" value={customer.contact} />
					<DetailInfo label="Paket Langganan" value={customer.plan} />
					<DetailInfo label="Status Langganan" value={customer.status === "ACTIVE" ? "Aktif" : "Nonaktif"} />
					<DetailInfo label="Berlaku Hingga" value={customer.expiredDisplay || "-"} />
				</div>

				<div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
					<button
						type="button"
						onClick={() => onToggleStatus(customer)}
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
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
		<p className="mt-2 text-sm font-medium text-slate-700">{value || "-"}</p>
	</div>
);

const CustomerTable = () => {
	const [subscribers, setSubscribers] = useState([]);
	const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedCustomer, setSelectedCustomer] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		getSubscriptions({ search, page, limit: 10 })
			.then((res) => {
				const list = extractList(res);
				const nextSubscribers = list.map(normalizeSubscriber);
				setSubscribers(nextSubscribers);
				setMeta(extractMeta(res, list));
			})
			.catch((err) => setError(err.message || "Gagal mengambil daftar pelanggan"))
			.finally(() => setLoading(false));
	}, [search, page]);

	const handleToggleStatus = (customer) => {
		setSubscribers((prev) =>
			prev.map((item) =>
				item.businessId === customer.businessId
					? { ...item, status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
					: item
			)
		);
		setSelectedCustomer((prev) =>
			prev && prev.businessId === customer.businessId
				? { ...prev, status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
				: prev
		);
	};

	const totalPages = Math.max(1, Math.ceil((meta.total ?? 0) / (meta.limit ?? 10)));

	return (
		<>
			<section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
				<div className="mb-3 grid gap-2 md:grid-cols-[1.5fr_1fr_1fr]">
					<label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
						<FiSearch size={16} />
						<input
							className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
							placeholder="Cari nama, email atau telepon..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
						/>
					</label>
				</div>

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
									<th className="w-[16%] px-4 py-2.5 font-medium">Nama</th>
									<th className="w-[27%] px-4 py-2.5 font-medium">Kontak</th>
									<th className="w-[16%] px-4 py-2.5 font-medium">Langganan</th>
									<th className="w-[11%] px-4 py-2.5 font-medium">Status</th>
									<th className="w-[6%] px-4 py-2.5 text-center font-medium">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{subscribers.length === 0 && (
									<tr>
										<td colSpan={6} className="px-4 py-8 text-center text-slate-400">
											Tidak ada pelanggan yang cocok.
										</td>
									</tr>
								)}
								{subscribers.map((sub) => (
									<tr key={sub.businessId} className="border-b border-slate-100 last:border-0">
										<td className="px-4 py-3">{sub.name}</td>
										<td className="truncate px-4 py-3" title={sub.contact}>
											{sub.contact}
										</td>
										<td className="px-4 py-3">{sub.plan}</td>
										<td className="px-4 py-3">
											<StatusBadge status={sub.status} />
										</td>
										<td className="px-4 py-3">
											<ActionButtons customer label={sub.name} onView={() => setSelectedCustomer(sub)} />
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

			{selectedCustomer && (
				<CustomerDetailCard
					customer={selectedCustomer}
					onClose={() => setSelectedCustomer(null)}
					onToggleStatus={handleToggleStatus}
				/>
			)}
		</>
	);
};

const FilterBar = ({
	firstPlaceholder,
	searchValue,
	onSearchChange,
	secondLabel,
	secondValue,
	onSecondChange,
	secondOptions = [],
	thirdLabel,
	thirdValue,
	onThirdChange,
	thirdOptions = [],
}) => (
	<div className="mb-3 grid gap-2 md:grid-cols-[1.5fr_1fr_1fr]">
		<label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
			<FiSearch size={16} />
			<input
				className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
				placeholder={firstPlaceholder}
				value={searchValue}
				onChange={(e) => onSearchChange?.(e.target.value)}
			/>
		</label>
		<select
			className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
			value={secondValue ?? ""}
			onChange={(e) => onSecondChange?.(e.target.value)}
		>
			<option value="">{secondLabel}</option>
			{secondOptions.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
		<select
			className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
			value={thirdValue ?? ""}
			onChange={(e) => onThirdChange?.(e.target.value)}
		>
			<option value="">{thirdLabel}</option>
			{thirdOptions.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
	</div>
);

export default ManajementUserSuperAdmin;