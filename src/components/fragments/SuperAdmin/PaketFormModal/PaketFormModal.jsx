import { useEffect, useState } from "react";
import { FiX, FiLoader, FiPlus, FiTrash2 } from "react-icons/fi";
import { createLangganan, updateLangganan } from "../../../../services/SuperAdmin/paketlangganan.service"
const emptyForm = {
	name: "",
	description: "",
	price: "",
	billingCycle: "MONTHLY",
	maxBranches: "",
	maxKasir: "",
	isActive: true,
	features: [""],
};

const PaketFormModal = ({ mode, initialData, onClose, onSuccess }) => {
	const [form, setForm] = useState(emptyForm);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const isEdit = mode === "edit";

	useEffect(() => {
		if (isEdit && initialData) {
			setForm({
				name: initialData.name || "",
				description: initialData.description || "",
				price: initialData.price ?? "",
				billingCycle: initialData.billingCycle || "MONTHLY",
				maxBranches: initialData.maxBranches ?? "",
				maxKasir: initialData.maxKasir ?? "",
				isActive: initialData.isActive ?? true,
				features: initialData.features?.length ? initialData.features : [""],
			});
		} else {
			setForm(emptyForm);
		}
	}, [mode, initialData]);

	const handleChange = (field) => (e) => {
		const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleFeatureChange = (index, value) => {
		setForm((prev) => {
			const next = [...prev.features];
			next[index] = value;
			return { ...prev, features: next };
		});
	};

	const addFeature = () => setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
	const removeFeature = (index) =>
		setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);

		const payload = {
			name: form.name,
			description: form.description,
			price: Number(form.price),
			billingCycle: form.billingCycle,
			maxBranches: Number(form.maxBranches),
			maxKasir: Number(form.maxKasir),
			isActive: form.isActive,
			features: form.features.map((f) => f.trim()).filter(Boolean),
		};

		try {
			if (isEdit) {
				const res = await updateLangganan(initialData.id, payload);
				onSuccess({ mode: "edit", id: initialData.id, data: res?.data });
			} else {
				const res = await createLangganan(payload);
				onSuccess({ mode: "create", data: res?.data });
			}
		} catch (err) {
			setError(err.message || "Gagal menyimpan data paket");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
			<div
				className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between">
					<h2 className="text-lg font-semibold text-slate-800">{isEdit ? "Edit Paket" : "Tambah Paket"}</h2>
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
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Nama Paket</label>
						<input
							required
							type="text"
							value={form.name}
							onChange={handleChange("name")}
							placeholder="mis. Paket Starter"
							className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Deskripsi</label>
						<textarea
							required
							rows={2}
							value={form.description}
							onChange={handleChange("description")}
							placeholder="Deskripsi singkat paket ini"
							className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Harga (Rp)</label>
							<input
								required
								type="number"
								min="0"
								value={form.price}
								onChange={handleChange("price")}
								placeholder="99000"
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Siklus Tagihan</label>
							<select
								value={form.billingCycle}
								onChange={handleChange("billingCycle")}
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							>
								<option value="MONTHLY">Bulanan</option>
								<option value="YEARLY">Tahunan</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Maks Cabang</label>
							<input
								required
								type="number"
								min="1"
								value={form.maxBranches}
								onChange={handleChange("maxBranches")}
								placeholder="1"
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-600">Maks Kasir</label>
							<input
								required
								type="number"
								min="1"
								value={form.maxKasir}
								onChange={handleChange("maxKasir")}
								placeholder="3"
								className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium text-slate-600">Fitur</label>
						<div className="space-y-2">
							{form.features.map((feature, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type="text"
										value={feature}
										onChange={(e) => handleFeatureChange(index, e.target.value)}
										placeholder="mis. POS Kasir"
										className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
									/>
									<button
										type="button"
										aria-label="Hapus fitur"
										onClick={() => removeFeature(index)}
										disabled={form.features.length === 1}
										className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-red-500 hover:bg-red-50 disabled:opacity-40"
									>
										<FiTrash2 size={15} />
									</button>
								</div>
							))}
						</div>
						<button
							type="button"
							onClick={addFeature}
							className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#1c86ef] hover:underline"
						>
							<FiPlus size={14} />
							Tambah fitur
						</button>
					</div>

					<label className="flex items-center gap-2 text-sm text-slate-600">
						<input type="checkbox" checked={form.isActive} onChange={handleChange("isActive")} className="h-4 w-4 rounded border-slate-300" />
						Paket aktif
					</label>

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
							{isEdit ? "Simpan Perubahan" : "Tambah Paket"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PaketFormModal;