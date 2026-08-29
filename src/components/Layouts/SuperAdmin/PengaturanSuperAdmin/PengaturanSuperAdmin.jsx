import { useEffect, useState } from "react";
import { FiLoader, FiSave, FiUpload } from "react-icons/fi";
import { getGlobalSettings, updateGlobalSettings, uploadLogo } from "../../../../services/SuperAdmin/setting.service"; 

// Opsi dropdown — kode yang dikirim ke backend (value) mengikuti contoh di PUT /settings,
// label yang ditampilkan mengikuti tampilan di Figma. Sesuaikan kalau backend punya opsi lain.
const LANGUAGE_OPTIONS = [
	{ value: "id", label: "Indonesia" },
	{ value: "en", label: "English" },
];

const TIMEZONE_OPTIONS = [
	{ value: "Asia/Jakarta", label: "GMT +7 Jakarta (WIB)" },
	{ value: "Asia/Makassar", label: "GMT +8 Makassar (WITA)" },
	{ value: "Asia/Jayapura", label: "GMT +9 Jayapura (WIT)" },
];

const CURRENCY_OPTIONS = [{ value: "IDR", label: "Rupiah (IDR)" }];

const DATE_FORMAT_OPTIONS = [
	{ value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
	{ value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
	{ value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

// Coba petakan nilai lama (format panjang dari GET, mis. "Indonesia", "GMT +7 Jakarta")
// ke kode pendek yang dipakai dropdown. Kalau tidak ketemu, fallback ke value asli
// (supaya tetap kelihatan sebagai custom value alih-alih diam-diam diganti).
const matchOption = (options, rawValue) => {
	if (!rawValue) return options[0]?.value ?? "";
	const exact = options.find((o) => o.value === rawValue);
	if (exact) return exact.value;
	const byLabel = options.find((o) => o.label.toLowerCase().includes(String(rawValue).toLowerCase()));
	return byLabel ? byLabel.value : rawValue;
};

const FieldLabel = ({ children }) => (
	<span className="mb-1.5 block text-sm font-medium text-slate-700">
		{children} <span className="text-red-500">*</span>
	</span>
);

const TextField = ({ label, value, onChange }) => (
	<label className="block">
		<FieldLabel>{label}</FieldLabel>
		<input
			type="text"
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value)}
			className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
		/>
	</label>
);

const SelectField = ({ label, value, onChange, options }) => (
	<label className="block">
		<FieldLabel>{label}</FieldLabel>
		<select
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value)}
			className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-[#1c86ef] focus:outline-none"
		>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	</label>
);

const emptyForm = {
	appName: "",
	defaultLanguage: "id",
	logoUrl: "",
	timezone: "Asia/Jakarta",
	currency: "IDR",
	dateFormat: "DD/MM/YYYY",
	emailNotification: "",
};

const PengaturanSuperAdmin = () => {
	const [form, setForm] = useState(emptyForm);
	const [initialForm, setInitialForm] = useState(emptyForm);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const loadSettings = () => {
		setLoading(true);
		setError(null);
		getGlobalSettings()
			.then((res) => {
				const data = res?.data ?? {};
				const normalized = {
					appName: data.appName ?? "",
					defaultLanguage: matchOption(LANGUAGE_OPTIONS, data.defaultLanguage),
					logoUrl: data.logoUrl ?? "",
					timezone: matchOption(TIMEZONE_OPTIONS, data.timezone),
					currency: matchOption(CURRENCY_OPTIONS, data.currency),
					dateFormat: matchOption(DATE_FORMAT_OPTIONS, data.dateFormat),
					emailNotification: data.emailNotification ?? "",
				};
				setForm(normalized);
				setInitialForm(normalized);
			})
			.catch((err) => setError(err.message || "Gagal mengambil pengaturan sistem"))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadSettings();
	}, []);

	const handleChange = (field) => (value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleLogoChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		setError(null);
		try {
			const uploadedUrl = await uploadLogo(file);
			setForm((prev) => ({ ...prev, logoUrl: uploadedUrl }));
		} catch (err) {
			setError(err.message || "Gagal mengunggah logo");
		} finally {
			setUploading(false);
			e.target.value = ""; // reset input supaya bisa pilih file sama lagi kalau perlu
		}
	};

	const handleReset = () => {
		setForm(initialForm);
		setError(null);
		setSuccessMessage(null);
	};

	const handleSave = async () => {
		setSaving(true);
		setError(null);
		setSuccessMessage(null);
		try {
			await updateGlobalSettings(form);
			setInitialForm(form);
			setSuccessMessage("Pengaturan berhasil disimpan.");
		} catch (err) {
			setError(err.message || "Gagal menyimpan pengaturan sistem");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
				<div className="flex items-center justify-center gap-2 py-16 text-slate-400">
					<FiLoader className="animate-spin" size={20} />
					<span className="text-sm">Memuat pengaturan...</span>
				</div>
			</main>
		);
	}

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
			<header className="mb-5">
				<h1 className="text-[2.1rem] font-bold tracking-tight text-slate-800">Pengaturan</h1>
				<p className="mt-1 text-sm text-slate-500">Kelola pengaturan aplikasi untuk semua cabang</p>
			</header>

			<section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 className="text-base font-semibold text-slate-800">Informasi Sistem</h2>

				<div className="mt-5 grid gap-5 md:grid-cols-2">
					<TextField label="Nama Aplikasi" value={form.appName} onChange={handleChange("appName")} />
					<SelectField
						label="Bahasa Default"
						value={form.defaultLanguage}
						onChange={handleChange("defaultLanguage")}
						options={LANGUAGE_OPTIONS}
					/>

					<div>
						<FieldLabel>Logo Sistem</FieldLabel>
						<label className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
							<span className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-slate-600">
								{uploading ? <FiLoader className="animate-spin" size={14} /> : <FiUpload size={14} />}
								{uploading ? "Mengunggah..." : "Telusuri File"}
							</span>
							<span className="truncate">
								{form.logoUrl ? form.logoUrl : "Max 10MB, PNG, JPEG"}
							</span>
							<input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoChange} disabled={uploading} />
						</label>
					</div>
					<SelectField
						label="Zona Waktu"
						value={form.timezone}
						onChange={handleChange("timezone")}
						options={TIMEZONE_OPTIONS}
					/>

					<SelectField
						label="Mata Uang Default"
						value={form.currency}
						onChange={handleChange("currency")}
						options={CURRENCY_OPTIONS}
					/>
					<SelectField
						label="Format Tanggal"
						value={form.dateFormat}
						onChange={handleChange("dateFormat")}
						options={DATE_FORMAT_OPTIONS}
					/>
				</div>

				{error && <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
				{successMessage && (
					<p className="mt-5 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>
				)}
			</section>

			<div className="mt-5 flex justify-end gap-3">
				<button
					type="button"
					onClick={handleReset}
					disabled={saving}
					className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
				>
					Reset
				</button>
				<button
					type="button"
					onClick={handleSave}
					disabled={saving || uploading}
					className="flex h-11 items-center gap-2 rounded-xl bg-[#1c86ef] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1779dc] disabled:opacity-60"
				>
					{saving ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
					{saving ? "Menyimpan..." : "Simpan Pengaturan"}
				</button>
			</div>
		</main>
	);
};

export default PengaturanSuperAdmin;