import { useEffect, useState } from "react";
import { FiLoader, FiSave, FiUpload } from "react-icons/fi";
import { getGlobalSettings, updateGlobalSettings, uploadLogo } from "../../../../services/SuperAdmin/setting.service"; 
import { useTranslation } from "react-i18next";
import { useSettings } from "../../../../context/SettingsContext";

const LANGUAGE_OPTIONS = [
	{ value: "Indonesia", label: "Indonesia" },
	{ value: "English", label: "English" },
];


const TIMEZONE_OPTIONS = [
	{ value: "GMT +7 Jakarta", label: "GMT +7 Jakarta (WIB)" },
	{ value: "GMT +8 Makassar", label: "GMT +8 Makassar (WITA)" },
	{ value: "GMT +9 Jayapura", label: "GMT +9 Jayapura (WIT)" },
];

const CURRENCY_OPTIONS = [
	{ value: "Rupiah (IDR)", label: "Rupiah (IDR)" },
	{ value: "US Dollar (USD)", label: "US Dollar (USD)" },
];

const DATE_FORMAT_OPTIONS = [
	{ value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
	{ value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
	{ value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];


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
	defaultLanguage: "Indonesia",
	timezone: "GMT +7 Jakarta",
	currency: "Rupiah (IDR)",
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

	const { t } = useTranslation();
	const { refreshSettings } = useSettings();



	const loadSettings = () => {
		setLoading(true);
		setError(null);
		getGlobalSettings()
			.then((res) => {
				const data = res?.data ?? {};
				const normalized = {
					appName: data.appName ?? "",
					defaultLanguage: matchOption(LANGUAGE_OPTIONS, data.defaultLanguage),
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
		await refreshSettings(); // <- ini yang bikin bahasa/timezone/currency langsung ter-apply global
		setSuccessMessage(t("settings.saveSuccess"));
	} catch (err) {
		setError(err.message || t("settings.saveError"));
	} finally {
		setSaving(false);
	}
};

if (loading) {
	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
			<div className="flex items-center justify-center gap-2 py-16 text-slate-400">
				<FiLoader className="animate-spin" size={20} />
				<span className="text-sm">{t("settings.loading")}</span>
			</div>
		</main>
	);
}

return (
	<main className="min-w-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-8">
		<header className="mb-5">
			<h1 className="text-[2.1rem] font-bold tracking-tight text-slate-800">{t("settings.title")}</h1>
			<p className="mt-1 text-sm text-slate-500">{t("settings.subtitle")}</p>
		</header>

		<section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-800">{t("settings.systemInfo")}</h2>

			<div className="mt-5 grid gap-5 md:grid-cols-2">
				<TextField label={t("settings.appName")} value={form.appName} onChange={handleChange("appName")} />
				<SelectField
					label={t("settings.defaultLanguage")}
					value={form.defaultLanguage}
					onChange={handleChange("defaultLanguage")}
					options={LANGUAGE_OPTIONS}
				/>
				<SelectField
					label={t("settings.timezone")}
					value={form.timezone}
					onChange={handleChange("timezone")}
					options={TIMEZONE_OPTIONS}
				/>
				<SelectField
					label={t("settings.currency")}
					value={form.currency}
					onChange={handleChange("currency")}
					options={CURRENCY_OPTIONS}
				/>
				<SelectField
					label={t("settings.dateFormat")}
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
				{t("settings.reset")}
			</button>
			<button
				type="button"
				onClick={handleSave}
				disabled={saving}
				className="flex h-11 items-center gap-2 rounded-xl bg-[#1c86ef] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1779dc] disabled:opacity-60"
			>
				{saving ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
				{saving ? t("settings.saving") : t("settings.save")}
			</button>
		</div>
	</main>
);
};

export default PengaturanSuperAdmin;