import { FiChevronDown, FiSave } from "react-icons/fi";

const SelectField = ({ label, value }) => (
    <label className="block min-w-0">
        <span className="mb-2 block text-sm font-medium text-slate-700">{label} <b className="text-red-500">*</b></span>
        <span className="relative block">
            <select defaultValue="" className="h-11 w-full appearance-none rounded-xl border-0 bg-slate-100 px-3 text-sm text-slate-600 outline-none">
                <option value="">{value}</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-3.5 text-slate-400" size={17} />
        </span>
    </label>
);

const TextField = ({ label, value }) => (
    <label className="block min-w-0"><span className="mb-2 block text-sm font-medium text-slate-700">{label} <b className="text-red-500">*</b></span><input defaultValue={value} className="h-11 w-full rounded-xl border-0 bg-slate-100 px-3 text-sm text-slate-600 outline-none" /></label>
);

const PengaturanSuperAdmin = () => (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8">
        <header><h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1><p className="mt-1 text-base text-slate-500">Kelola pengaturan aplikasi untuk semua cabang</p></header>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-base font-semibold text-slate-700">Informasi Sistem</h2><div className="mt-4 grid gap-x-5 gap-y-5 md:grid-cols-2"><TextField label="Nama Aplikasi" value="Mitbis POS" /><SelectField label="Bahasa Default" value="Indonesia" /><label className="block min-w-0"><span className="mb-2 block text-sm font-medium text-slate-700">Logo Sistem <b className="text-red-500">*</b></span><span className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs text-slate-400"><button type="button" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Telusuri File</button><span>Max 10MB, PNG, JPEG</span></span></label><SelectField label="Zona Waktu" value="GMT +7 Jakarta" /><SelectField label="Mata Uang Default" value="Rupiah (IDR)" /><SelectField label="Format Tanggal" value="DD/MM/YYYY" /></div></section>
        <div className="mt-5 flex justify-end gap-3"><button type="button" className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-600 hover:bg-slate-100">Reset</button><button type="button" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1c86ef] px-5 text-sm font-medium text-white shadow-sm hover:bg-[#1779dc]"><FiSave size={17} />Simpan Pengaturan</button></div>
    </main>
);

export default PengaturanSuperAdmin;
