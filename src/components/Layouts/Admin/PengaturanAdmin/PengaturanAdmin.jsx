import { useContext, useEffect, useState } from "react";
import { FiRefreshCcw, FiSave } from "react-icons/fi";
import { AuthContext } from "../../../../context/AuthContext";
import { getMe } from "../../../../services/auth.service";
import { getBranches } from "../../../../services/branch.service";
import { getSetting, updateBusinessSetting } from "../../../../services/setting.service";
import { useNotification } from "../../../ui/NotificationCenter";

const initialForm = { businessName: "", phone: "", email: "", address: "", discountEnabled: true, discountPercentage: "", minPurchaseAmount: "", taxEnabled: true, taxPercentage: "" };
const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};
const pick = (sources, keys, fallback = "") => {
  const sourceList = Array.isArray(sources) ? sources : [sources];
  for (const source of sourceList) {
    for (const key of keys) {
      if (source?.[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];
    }
  }
  return fallback;
};

const findNested = (source, keys, visited = new Set()) => {
  if (!source || typeof source !== "object" || visited.has(source)) return "";
  visited.add(source);
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];
  }
  for (const value of Object.values(source)) {
    const result = findNested(value, keys, visited);
    if (result !== "") return result;
  }
  return "";
};

const PengaturanAdmin = () => {
  const notification = useNotification();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [initialValues, setInitialValues] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingResponse, meResponse, branchesResponse] = await Promise.allSettled([getSetting(), getMe(), getBranches()]);
        const setting = settingResponse.status === "fulfilled" ? unwrap(settingResponse.value) : {};
        const me = meResponse.status === "fulfilled" ? unwrap(meResponse.value) : user ?? {};
        const branchesData = branchesResponse.status === "fulfilled" ? unwrap(branchesResponse.value) : [];
        const branches = Array.isArray(branchesData) ? branchesData : branchesData.outlets ?? [];
        const business = setting.business ?? setting.businessProfile ?? {};
        const meBusiness = me.business ?? me.businessProfile ?? {};
        const outlet = setting.outlet ?? me.outlet ?? me.outletProfile ?? branches[0] ?? {};
        const sources = [business, setting, meBusiness, me, outlet, user ?? {}];
        const city = pick(sources, ["city"]);
        const province = pick(sources, ["province"]);
        const defaultAddress = city || province ? [city, province].filter(Boolean).join(", ") : "";
        const discount = setting.discount ?? setting.discountSettings ?? setting;
        const tax = setting.tax ?? setting.taxSettings ?? setting;
        const values = {
          businessName: pick(sources, ["businessName", "name"]),
          phone: findNested({ settings: setting, business, me, outlet, user }, ["phone", "phoneNumber", "businessPhone", "outletPhone"]),
          email: pick(sources, ["email", "emailAddress"]),
          address: pick(sources, ["address", "businessAddress", "outletAddress"], defaultAddress),
          discountEnabled: Boolean(pick(discount, ["discountEnabled", "isDiscountActive", "enableDiscount"], true)),
          discountPercentage: pick(discount, ["discountPercentage", "discountPercent", "maxDiscountPercentage"]),
          minPurchaseAmount: pick(discount, ["minPurchaseAmount", "minimumPurchaseAmount", "discountMinimumAmount", "maxDiscountAmount"]),
          taxEnabled: Boolean(pick(tax, ["taxEnabled", "isTaxActive", "enableTax"], true)),
          taxPercentage: pick(tax, ["taxPercentage", "taxPercent", "rate"]),
        };
        setForm(values);
        setInitialValues(values);
      } catch (error) {
        notification.error(error.message || "Gagal memuat pengaturan.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleToggle = (name) => setForm((current) => ({ ...current, [name]: !current[name] }));
  const handleSubmit = async () => {
    if (!form.businessName.trim() || !form.phone.trim() || !form.address.trim()) {
      notification.error("Nama bisnis, telepon, dan alamat wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await updateBusinessSetting({
        businessName: form.businessName.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim(),
        discountEnabled: form.discountEnabled, discountPercentage: form.discountEnabled ? Number(form.discountPercentage || 0) : 0,
        minPurchaseAmount: form.discountEnabled ? Number(form.minPurchaseAmount || 0) : 0, taxEnabled: form.taxEnabled,
        taxPercentage: form.taxEnabled ? Number(form.taxPercentage || 0) : 0,
      });
      notification.success("Pengaturan berhasil disimpan.");
    } catch (error) { notification.error(error.message || "Pengaturan gagal disimpan."); }
    finally { setSaving(false); }
  };

  const Toggle = ({ name, label, description }) => (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div><p className="font-medium text-slate-700">{label}</p><p className="text-sm text-slate-500">{description}</p></div>
      <button type="button" onClick={() => handleToggle(name)} className={`relative h-7 w-12 rounded-full p-1 ${form[name] ? "bg-blue-500" : "bg-slate-300"}`} aria-label={label}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm ${form[name] ? "right-1" : "left-1"}`} /></button>
    </div>
  );

  if (loading) return <div className="rounded-2xl border-2 border-gray-300 bg-white p-8 text-slate-500">Memuat pengaturan...</div>;
  const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-blue-400";
  return <div className="rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-[0_0_0_1px_rgba(27,142,245,0.08)]"><div className="space-y-6">
    <section className="space-y-4"><h3 className="text-lg font-semibold text-slate-800">Informasi Bisnis</h3><div className="grid grid-cols-2 gap-4">
      {[['businessName','Nama bisnis','text'],['phone','Telepon','text'],['email','Email','email'],['address','Alamat','text']].map(([name,label,type]) => <label key={name} className="text-sm font-medium text-slate-700">{label}{name !== 'email' && <span className="text-red-500"> *</span>}<input name={name} type={type} value={form[name]} onChange={handleChange} className={inputClass} /></label>)}
    </div></section>
    <section className="space-y-4 border-t border-slate-200 pt-5"><h3 className="text-lg font-semibold text-slate-800">Pengaturan Diskon</h3><Toggle name="discountEnabled" label="Aktifkan Fitur Diskon" description="Diskon otomatis berdasarkan minimal pembelian" /><div className="grid grid-cols-2 gap-4">
      <label className="text-sm font-medium text-slate-700">Persentase Diskon (%)<input name="discountPercentage" type="number" min="0" step="0.01" value={form.discountPercentage} onChange={handleChange} disabled={!form.discountEnabled} className={`${inputClass} disabled:opacity-50`} /><span className="mt-1 block text-xs font-normal text-slate-500">Admin bebas menentukan persentase diskon.</span></label>
      <label className="text-sm font-medium text-slate-700">Minimal Pembelian (Rp)<input name="minPurchaseAmount" type="number" min="0" value={form.minPurchaseAmount} onChange={handleChange} disabled={!form.discountEnabled} className={`${inputClass} disabled:opacity-50`} /><span className="mt-1 block text-xs font-normal text-slate-500">Diskon berlaku saat subtotal mencapai nominal ini.</span></label>
    </div></section>
    <section className="space-y-4 border-t border-slate-200 pt-5"><h3 className="text-lg font-semibold text-slate-800">Pengaturan Pajak</h3><Toggle name="taxEnabled" label="Aktifkan Pajak" description="Terapkan pajak pada setiap transaksi" /><label className="block text-sm font-medium text-slate-700">Persentase Pajak (%)<input name="taxPercentage" type="number" min="0" step="0.01" value={form.taxPercentage} onChange={handleChange} disabled={!form.taxEnabled} className={`${inputClass} disabled:opacity-50`} /></label></section>
  </div><div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4"><button type="button" onClick={() => setForm(initialValues)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><FiRefreshCcw size={16} /> Reset</button><button type="button" onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1779dc] disabled:opacity-50"><FiSave size={16} /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}</button></div></div>;
};

export default PengaturanAdmin;