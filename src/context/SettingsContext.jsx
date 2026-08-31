import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGlobalSettings } from "../services/SuperAdmin/setting.service"

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
	appName: "Mitbiz",
	defaultLanguage: "Indonesia",
	timezone: "GMT +7 Jakarta",
	currency: "Rupiah (IDR)",
	dateFormat: "DD/MM/YYYY",
};

export const SettingsProvider = ({ children }) => {
	const { i18n } = useTranslation();
	const [settings, setSettings] = useState(DEFAULT_SETTINGS);
	const [loading, setLoading] = useState(true);

	const applyLanguage = (lang) => {
		i18n.changeLanguage(lang === "English" ? "en" : "id");
	};

	const refreshSettings = async () => {
		try {
			const res = await getGlobalSettings();
			const data = res?.data ?? DEFAULT_SETTINGS;
			setSettings(data);
			applyLanguage(data.defaultLanguage);
		} catch {
			applyLanguage(DEFAULT_SETTINGS.defaultLanguage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshSettings();
	}, []);

	return (
		<SettingsContext.Provider value={{ settings, setSettings, refreshSettings, loading }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const ctx = useContext(SettingsContext);
	if (!ctx) throw new Error("useSettings harus dipakai di dalam SettingsProvider");
	return ctx;
};