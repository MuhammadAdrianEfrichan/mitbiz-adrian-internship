const TIMEZONE_MAP = {
	"GMT +7 Jakarta": "Asia/Jakarta",
	"GMT +8 Makassar": "Asia/Makassar",
	"GMT +9 Jayapura": "Asia/Jayapura",
};

const CURRENCY_MAP = {
	"Rupiah (IDR)": { locale: "id-ID", code: "IDR" },
	"US Dollar (USD)": { locale: "en-US", code: "USD" },
};

export const formatCurrency = (amount, currencySetting) => {
	const conf = CURRENCY_MAP[currencySetting] ?? CURRENCY_MAP["Rupiah (IDR)"];
	return new Intl.NumberFormat(conf.locale, { style: "currency", currency: conf.code }).format(amount);
};

export const formatDate = (date, dateFormat) => {
	const d = new Date(date);
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yyyy = d.getFullYear();

	switch (dateFormat) {
		case "MM/DD/YYYY":
			return `${mm}/${dd}/${yyyy}`;
		case "YYYY-MM-DD":
			return `${yyyy}-${mm}-${dd}`;
		case "DD/MM/YYYY":
		default:
			return `${dd}/${mm}/${yyyy}`;
	}
};

export const formatDateTime = (date, timezoneSetting) => {
	const tz = TIMEZONE_MAP[timezoneSetting] ?? "Asia/Jakarta";
	return new Intl.DateTimeFormat("id-ID", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: tz,
	}).format(new Date(date));
};