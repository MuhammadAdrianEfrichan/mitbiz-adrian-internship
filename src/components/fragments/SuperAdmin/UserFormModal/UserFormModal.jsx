import { useEffect, useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { createUsers, updateUsers } from "../../../../services/SuperAdmin/manajementuser.service"

const emptyForm = {
	businessId: "",
	outletId: "",
	name: "",
	username: "",
	email: "",
	phone: "",
	role: "STAFF",
	status: "ACTIVE",
	password: "",
};

const UserFormModal = ({ mode, initialData, businessOptions, outletsByBusiness, onClose, onSuccess }) => {
	const [form, setForm] = useState(emptyForm);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const isEdit = mode === "edit";
	const isStaff = form.role === "STAFF";

	useEffect(() => {
		if (isEdit && initialData) {
			setForm({
				businessId: initialData.businessId || "",
				outletId: initialData.outletId || "",
				name: initialData.name || "",
				username: initialData.username && initialData.username !== "-" ? initialData.username : "",
				email: initialData.email || "",
				phone: initialData.phone || "",
				role: initialData.role || "STAFF",
				status: initialData.status || "ACTIVE",
				password: "",
			});
		} else {
			setForm({ ...emptyForm, businessId: businessOptions?.[0]?.id || "" });
		}
	}, [mode, initialData, businessOptions]);

	const availableOutlets = outletsByBusiness?.[form.businessId] || [];

	const handleChange = (field) => (e) => {
		const value = e.target.value;
		setForm((prev) => ({
			...prev,
			[field]: value,
			...(field === "businessId" ? { outletId: "" } : {}),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		// Backend mewajibkan username khusus untuk role STAFF
		if (isStaff && !form.username.trim()) {
			setError("Username wajib diisi untuk role Staff.");
			return;
		}

		setSubmitting(true);

		try {
			if (isEdit) {
				const payload = {
					name: form.name,
					username: isStaff ? form.username : form.username || null,
					email: form.email || null,
					phone: form.phone || null,
					role: form.role,
					status: form.status,
					outletId: form.outletId || null,
				};
				const res = await updateUsers(initialData.id, payload);
				onSuccess({ mode: "edit", id: initialData.id, data: res?.data });
			} else {
				if (!form.businessId) {
					setError("Pilih bisnis untuk user ini terlebih dahulu.");
					setSubmitting(false);
					return;
				}
				const payload = {
					businessId: form.businessId,
					outletId: form.outletId || null,
					name: form.name,
					username: isStaff ? form.username : form.username || undefined,
					email: form.email || null,
					phone: form.phone || null,
					role: form.role,
					password: form.password,
				};
				const res = await createUsers(payload);
				onSuccess({ mode: "create", data: res?.data });
			}
		} catch (err) {
			// Tangkap pesan error spesifik per field dari backend, mis. { errors: [{ field, message }] }
			const fieldError = err?.errors?.[0]?.message;
			setError(fieldError || err.message || "Gagal menyimpan data user");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onClick={onClose}
		>
			<div
				className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between">
					<h2 className="text-lg font-semibold text-slate-800">
						{isEdit ? "Edit User" : "Tambah User"}
					</h2>
					<button
						type="button"
						aria-label="Tutup"
						onClick={onClose}
						className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
					>
						<FiX size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="mt-5 space-y-4">
					{!isEdit && (
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Bisnis</label>
							<select
								required
								value={form.businessId}
								onChange={handleChange("businessId")}
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							>
								<option value="" disabled>
									Pilih bisnis...
								</option>
								{businessOptions?.map((b) => (
									<option key={b.id} value={b.id}>
										{b.name} {b.businessCode ? `· ${b.businessCode}` : ""}
									</option>
								))}
							</select>
						</div>
					)}

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">
							Cabang <span className="font-normal text-slate-400">(kosongkan untuk Semua Cabang)</span>
						</label>
						<select
							value={form.outletId}
							onChange={handleChange("outletId")}
							disabled={!form.businessId}
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none disabled:bg-slate-50"
						>
							<option value="">Semua Cabang</option>
							{availableOutlets.map((o) => (
								<option key={o.id} value={o.id}>
									{o.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Nama</label>
						<input
							required
							type="text"
							value={form.name}
							onChange={handleChange("name")}
							placeholder="mis. Budi Santoso"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">
							Username{" "}
							{isStaff && <span className="text-red-500">*</span>}
							{!isStaff && (
								<span className="font-normal text-slate-400">(opsional untuk Admin)</span>
							)}
						</label>
						<input
							required={isStaff}
							type="text"
							value={form.username}
							onChange={handleChange("username")}
							placeholder="mis. budi.kasir"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
						{isStaff && (
							<p className="mt-1 text-xs text-slate-400">Username wajib diisi untuk role Staff.</p>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">
							Email {isStaff && <span className="font-normal text-slate-400">(opsional)</span>}
						</label>
						<input
							type="email"
							value={form.email}
							onChange={handleChange("email")}
							placeholder="mis. budi@email.com"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Telepon</label>
						<input
							type="text"
							value={form.phone}
							onChange={handleChange("phone")}
							placeholder="mis. 08123456789"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Role</label>
						<select
							value={form.role}
							onChange={handleChange("role")}
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						>
							<option value="ADMIN">Admin</option>
							<option value="STAFF">Staff</option>
						</select>
					</div>

					{!isEdit && (
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Password</label>
							<input
								required
								type="password"
								value={form.password}
								onChange={handleChange("password")}
								placeholder="Password awal untuk user"
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							/>
						</div>
					)}

					{isEdit && (
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Status</label>
							<select
								value={form.status}
								onChange={handleChange("status")}
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							>
								<option value="ACTIVE">Aktif</option>
								<option value="INACTIVE">Nonaktif</option>
							</select>
						</div>
					)}

					{error && <p className="text-sm text-red-500">{error}</p>}

					<div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
						<button
							type="button"
							onClick={onClose}
							className="h-11 flex-1 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-100"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1c86ef] text-sm font-medium text-white transition hover:bg-[#1779dc] disabled:opacity-60"
						>
							{submitting && <FiLoader className="animate-spin" size={16} />}
							{isEdit ? "Simpan Perubahan" : "Tambah User"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UserFormModal;