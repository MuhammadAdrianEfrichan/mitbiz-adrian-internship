import { useEffect, useState } from "react";
import { FiX, FiLoader, FiMapPin, FiPhone } from "react-icons/fi";
import { getDetailBisnis } from "../../../../services/SuperAdmin/manajementbisnis.service"; // sesuaikan path

const statusBadge = (status) => {
	const normalized = (status || "").toUpperCase();
	if (normalized === "ACTIVE" || normalized === "AKTIF") {
		return "bg-[#1c86ef] text-white";
	}
	return "bg-slate-300 text-slate-700";
};

const statusLabel = (status) => {
	const normalized = (status || "").toUpperCase();
	if (normalized === "ACTIVE") return "Aktif";
	if (normalized === "INACTIVE") return "Nonaktif";
	return status || "-";
};

// Cari array user di berbagai kemungkinan bentuk response, dan
// normalisasi nama field (name/fullName, role/roleName, status/isActive, dst).
const extractUsers = (raw) => {
	const detail = raw?.data?.data ?? raw?.data ?? raw ?? {};
	const list =
		detail?.users ??
		detail?.userList ??
		detail?.members ??
		detail?.data?.users ??
		[];

	if (!Array.isArray(list)) return [];

	return list.map((u, idx) => ({
		id: u.id ?? idx,
		name: u.name ?? u.fullName ?? u.username ?? "-",
		role: u.role ?? u.roleName ?? u.jabatan ?? "-",
		status:
			u.status ??
			(typeof u.isActive === "boolean" ? (u.isActive ? "ACTIVE" : "INACTIVE") : "ACTIVE"),
	}));
};

const DetailCabangModal = ({ outlet, onClose }) => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!outlet?.id) return;

		let isMounted = true;
		setLoading(true);
		setError(null);

		getDetailBisnis(outlet.id)
			.then((res) => {
				if (!isMounted) return;
				setUsers(extractUsers(res));
			})
			.catch((err) => {
				if (!isMounted) return;
				setError(err.message || "Gagal mengambil detail cabang");
			})
			.finally(() => {
				if (isMounted) setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, [outlet?.id]);

	if (!outlet) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between">
					<h2 className="text-lg font-semibold text-slate-800">{outlet.name}</h2>
					<button
						type="button"
						aria-label="Tutup"
						onClick={onClose}
						className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
					>
						<FiX size={20} />
					</button>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="flex items-center gap-1.5 text-slate-500">
							<FiMapPin size={14} /> Alamat
						</p>
						<p className="mt-1 font-medium text-slate-700">{outlet.address || "-"}</p>
					</div>
					<div>
						<p className="flex items-center gap-1.5 text-slate-500">
							<FiPhone size={14} /> Telepon
						</p>
						<p className="mt-1 font-medium text-slate-700">{outlet.phone || "-"}</p>
					</div>
				</div>

				<div className="mt-5">
					<p className="text-sm text-slate-500">Status</p>
					<span
						className={`mt-1 inline-block rounded-md px-2.5 py-1 text-xs font-medium ${statusBadge(
							outlet.status
						)}`}
					>
						{statusLabel(outlet.status)}
					</span>
				</div>

				<div className="my-5 border-t border-slate-200" />

				<div>
					<p className="mb-3 text-sm font-medium text-slate-700">Pengguna di Cabang Ini</p>

					{loading && (
						<div className="flex items-center justify-center gap-2 py-8 text-slate-400">
							<FiLoader className="animate-spin" size={18} />
							<span className="text-sm">Memuat data pengguna...</span>
						</div>
					)}

					{!loading && error && (
						<p className="py-4 text-center text-sm text-red-500">{error}</p>
					)}

					{!loading && !error && users.length === 0 && (
						<p className="py-4 text-center text-sm text-slate-400">
							Belum ada pengguna di cabang ini.
						</p>
					)}

					{!loading && !error && users.length > 0 && (
						<div className="overflow-hidden rounded-xl border border-slate-200">
							<table className="w-full text-left text-sm">
								<thead className="bg-slate-50">
									<tr>
										<th className="px-4 py-2.5 font-medium text-slate-500">Nama</th>
										<th className="px-4 py-2.5 font-medium text-slate-500">Role</th>
										<th className="px-4 py-2.5 font-medium text-slate-500">Status</th>
									</tr>
								</thead>
								<tbody>
									{users.map((u) => (
										<tr key={u.id} className="border-t border-slate-100">
											<td className="px-4 py-2.5 text-slate-700">{u.name}</td>
											<td className="px-4 py-2.5">
												<span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600">
													{u.role}
												</span>
											</td>
											<td className="px-4 py-2.5">
												<span
													className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusBadge(
														u.status
													)}`}
												>
													{statusLabel(u.status)}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DetailCabangModal;