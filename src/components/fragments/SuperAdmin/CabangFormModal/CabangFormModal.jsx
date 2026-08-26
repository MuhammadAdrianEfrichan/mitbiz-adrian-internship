import { useEffect, useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { createBisnis, updateBisnis } from "../../../../services/SuperAdmin/manajementbisnis.service";

const emptyForm = {
	businessId: "",
	name: "",
	address: "",
	phone: "",
	status: "ACTIVE",
};

const CabangFormModal = ({ mode, initialData, businessOptions, onClose, onSuccess }) => {
	const [form, setForm] = useState(emptyForm);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const isEdit = mode === "edit";

	useEffect(() => {
		if (isEdit && initialData) {
			setForm({
				businessId: initialData.businessId || "",
				name: initialData.name || "",
				address: initialData.address || "",
				phone: initialData.phone || "",
				status: initialData.status || "ACTIVE",
			});
		} else {
			setForm({ ...emptyForm, businessId: businessOptions?.[0]?.id || "" });
		}
	}, [mode, initialData, businessOptions]);

	const handleChange = (field) => (e) => {
		setForm((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			if (isEdit) {
				const res = await updateBisnis(initialData.id, {
					name: form.name,
					address: form.address,
					phone: form.phone,
					status: form.status,
				});
				onSuccess({ mode: "edit", id: initialData.id, data: res?.data ?? form });
			} else {
				if (!form.businessId) {
					setError("Pilih bisnis untuk cabang ini terlebih dahulu.");
					setSubmitting(false);
					return;
				}
				const res = await createBisnis({
					businessId: form.businessId,
					name: form.name,
					address: form.address,
					phone: form.phone,
				});
				onSuccess({ mode: "create", data: res?.data });
			}
		} catch (err) {
			setError(err.message || "Gagal menyimpan data cabang");
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
				className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between">
					<h2 className="text-lg font-semibold text-slate-800">
						{isEdit ? "Edit Cabang" : "Tambah Cabang"}
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
						<label className="mb-1 block text-sm font-medium text-slate-600">Nama Cabang</label>
						<input
							required
							type="text"
							value={form.name}
							onChange={handleChange("name")}
							placeholder="mis. Cabang Siteba"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Alamat</label>
						<input
							required
							type="text"
							value={form.address}
							onChange={handleChange("address")}
							placeholder="mis. Jl. Siteba No. 12"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Telepon</label>
						<input
							required
							type="text"
							value={form.phone}
							onChange={handleChange("phone")}
							placeholder="mis. 08123456789"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

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
							{isEdit ? "Simpan Perubahan" : "Tambah Cabang"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CabangFormModal;