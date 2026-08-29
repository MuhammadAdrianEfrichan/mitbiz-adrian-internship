import { useEffect, useMemo, useState } from "react";
import {
	FiEdit2,
	FiLoader,
	FiMapPin,
	FiPhone,
	FiPlus,
	FiTrash2,
} from "react-icons/fi";
import { getBisnis, deleteBisnis } from "../../../../services/SuperAdmin/manajementbisnis.service"; // sesuaikan path
import DetailCabangModal from "../../../fragments/SuperAdmin/DetailCabangModal";
import CabangFormModal from "../../../fragments/SuperAdmin/CabangFormModal";

const formatRupiah = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value || 0);

const statusLabel = (status) => {
	const normalized = (status || "").toUpperCase();
	if (normalized === "ACTIVE") return "Aktif";
	if (normalized === "INACTIVE") return "Nonaktif";
	return status || "-";
};

const statusBadgeClass = (status) => {
	const normalized = (status || "").toUpperCase();
	if (normalized === "ACTIVE") return "bg-[#1c86ef] text-white";
	return "bg-slate-300 text-slate-700";
};

// Normalisasi 1 item outlet dari response getBisnis (data.data.data[])
const normalizeOutlet = (item) => ({
	id: item.id,
	businessId: item.businessId,
	name: item.name,
	address: item.address,
	phone: item.phone,
	status: item.status,
	businessName: item.business?.name,
	businessCode: item.business?.businessCode,
	userCount: item.stats?.userCount ?? item._count?.users ?? 0,
	revenue30d: item.stats?.revenue30d ?? 0,
	transactionCount30d: item.stats?.transactionCount30d ?? 0,
});

// Card diperbesar: padding, spacing, dan ukuran teks lebih lega (sesuai proporsi di Figma)
const BranchCard = ({ business, onDetail, onEdit, onDelete }) => (
	<article className="min-h-135 rounded-2xl border border-slate-300 bg-[#f8fafc] p-7 shadow-sm">
		<div className="flex items-start justify-between gap-3">
			<div>
				<h2 className="text-xl font-semibold text-slate-800">{business.name}</h2>
				{business.businessName && (
					<p className="mt-1 text-sm text-slate-400">
						{business.businessName}
						{business.businessCode ? ` · ${business.businessCode}` : ""}
					</p>
				)}
			</div>
			<span className={`rounded-md px-3 py-1.5 text-sm font-medium ${statusBadgeClass(business.status)}`}>
				{statusLabel(business.status)}
			</span>
		</div>

		<div className="mt-10 space-y-5 text-base text-slate-500">
			<p className="flex items-start gap-2.5">
				<FiMapPin className="mt-0.5 shrink-0" size={20} />
				<span>{business.address || "-"}</span>
			</p>
			<p className="flex items-center gap-2.5">
				<FiPhone className="shrink-0" size={20} />
				<span>{business.phone || "-"}</span>
			</p>
		</div>

		<div className="my-7 border-t border-slate-300" />

		<div className="grid grid-cols-2 gap-4 text-base">
			<div>
				<p className="text-slate-500">Pengguna</p>
				<p className="mt-2 text-xl font-medium text-slate-800">{business.userCount}</p>
			</div>
			<div>
				<p className="text-slate-500">Transaksi (30 hari)</p>
				<p className="mt-2 text-xl font-medium text-slate-800">{business.transactionCount30d}</p>
			</div>
		</div>

		<div className="mt-8 text-base">
			<p className="text-slate-500">Pendapatan (30 hari)</p>
			<p className="mt-2 text-2xl font-semibold text-[#1c86ef]">{formatRupiah(business.revenue30d)}</p>
		</div>

		<div className="mt-8 flex items-center gap-3 border-t border-slate-300 pt-7">
			<button
				type="button"
				onClick={() => onDetail(business)}
				className="h-11 flex-1 rounded-xl border border-slate-300 bg-white text-base font-medium text-slate-600 transition hover:bg-slate-100"
			>
				Detail
			</button>
			<button
				type="button"
				aria-label={`Edit ${business.name}`}
				onClick={() => onEdit(business)}
				className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
			>
				<FiEdit2 size={19} />
			</button>
			<button
				type="button"
				aria-label={`Hapus ${business.name}`}
				onClick={() => onDelete(business)}
				className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-red-500 transition hover:bg-red-50"
			>
				<FiTrash2 size={19} />
			</button>
		</div>
	</article>
);

const ManajementBisnisSuperAdmin = () => {
	const [businesses, setBusinesses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedOutlet, setSelectedOutlet] = useState(null);
	const [formModal, setFormModal] = useState(null); // { mode: "create" | "edit", data?: business }

	const loadOutlets = () => {
		setLoading(true);
		setError(null);
		getBisnis()
			.then((res) => {
				const list = res?.data?.data ?? [];
				setBusinesses(list.map(normalizeOutlet));
			})
			.catch((err) => setError(err.message || "Gagal mengambil daftar cabang"))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadOutlets();
	}, []);

	// Daftar bisnis unik, diambil dari outlet yang sudah ada — dipakai sebagai opsi saat "Tambah Cabang"
	const businessOptions = useMemo(() => {
		const map = new Map();
		businesses.forEach((b) => {
			if (b.businessId && !map.has(b.businessId)) {
				map.set(b.businessId, {
					id: b.businessId,
					name: b.businessName,
					businessCode: b.businessCode,
				});
			}
		});
		return Array.from(map.values());
	}, [businesses]);

	const handleDelete = async (business) => {
		if (!window.confirm(`Hapus cabang "${business.name}"?`)) return;
		try {
			await deleteBisnis(business.id);
			setBusinesses((prev) => prev.filter((b) => b.id !== business.id));
		} catch (err) {
			alert(err.message || "Gagal menghapus cabang");
		}
	};

	const handleFormSuccess = () => {
		setFormModal(null);
		loadOutlets(); // refresh daftar setelah create/update
	};

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
			<header className="mb-5 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-[2.1rem] font-bold tracking-tight text-slate-800">Manajemen Cabang</h1>
					<p className="mt-1 text-sm text-slate-500">Kelola semua cabang di seluruh lokasi</p>
				</div>
				<button
					type="button"
					onClick={() => setFormModal({ mode: "create" })}
					className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
				>
					<FiPlus size={17} />
					Tambah Cabang
				</button>
			</header>

			{loading && (
				<div className="mt-16 flex items-center justify-center gap-2 text-slate-400">
					<FiLoader className="animate-spin" size={20} />
					<span>Memuat daftar cabang...</span>
				</div>
			)}

			{!loading && error && (
				<div className="mt-16 text-center text-sm text-red-500">{error}</div>
			)}

			{!loading && !error && businesses.length === 0 && (
				<div className="mt-16 text-center text-sm text-slate-400">
					Belum ada cabang yang terdaftar.
				</div>
			)}

			{!loading && !error && businesses.length > 0 && (
				<section className="mt-6 grid max-w-7xl gap-6 xl:grid-cols-3" aria-label="Daftar cabang">
					{businesses.map((business) => (
						<BranchCard
							key={business.id}
							business={business}
							onDetail={setSelectedOutlet}
							onEdit={(b) => setFormModal({ mode: "edit", data: b })}
							onDelete={handleDelete}
						/>
					))}
				</section>
			)}

			{selectedOutlet && (
				<DetailCabangModal outlet={selectedOutlet} onClose={() => setSelectedOutlet(null)} />
			)}

			{formModal && (
				<CabangFormModal
					mode={formModal.mode}
					initialData={formModal.data}
					businessOptions={businessOptions}
					onClose={() => setFormModal(null)}
					onSuccess={handleFormSuccess}
				/>
			)}
		</main>
	);
};

export default ManajementBisnisSuperAdmin;