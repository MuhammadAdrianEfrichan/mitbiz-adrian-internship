import { FiPlus, FiRefreshCcw, FiSave } from "react-icons/fi";

const PengaturanAdmin = () => {
  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-[0_0_0_1px_rgba(27,142,245,0.08)]">
      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Informasi Bisnis</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nama bisnis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Toko Makmur Jaya"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="021-12345678"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                defaultValue="info@tokomakmur.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Alamat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Jl. Raya Jakarta No. 123"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-5">
          <h3 className="text-lg font-semibold text-slate-800">Pengaturan Diskon</h3>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div>
              <p className="font-medium text-slate-700">Aktifkan Fitur Diskon</p>
              <p className="text-sm text-slate-500">Izinkan kasir memberikan diskon pada transaksi</p>
            </div>
            <button
              type="button"
              className="relative h-7 w-12 rounded-full bg-blue-500 p-1 transition-all"
              aria-label="Toggle diskon"
            >
              <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Maksimal Persentase Diskon (%)
              </label>
              <input
                type="text"
                defaultValue="50"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
              <p className="mt-1 text-xs text-slate-500">Maksimal diskon yang dapat diberikan kasir</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Maksimal Nominal Diskon (Rp)
              </label>
              <input
                type="text"
                defaultValue="100000"
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
              <p className="mt-1 text-xs text-slate-500">Optional, kosongan jika tidak ada batasan</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Pilih Produk</label>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5">
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700">
                Nasi Goreng
                <span className="text-slate-400">×</span>
              </span>
              <input
                type="text"
                placeholder="Ketik Nama Produk"
                className="min-w-[120px] flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-700"
                aria-label="Tambah produk"
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-5">
          <h3 className="text-lg font-semibold text-slate-800">Pengaturan Pajak</h3>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div>
              <p className="font-medium text-slate-700">Aktifkan Pajak</p>
              <p className="text-sm text-slate-500">Terapkan pajak pada setiap transaksi</p>
            </div>
            <button
              type="button"
              className="relative h-7 w-12 rounded-full bg-blue-500 p-1 transition-all"
              aria-label="Toggle pajak"
            >
              <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Persentase Pajak (%)
            </label>
            <input
              type="text"
              defaultValue="10"
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
            />
            <p className="mt-1 text-xs text-slate-500">Persentase pajak yang akan diterapkan (contoh: PPN 10%)</p>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <FiRefreshCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
        >
          <FiSave size={16} />
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
};

export default PengaturanAdmin;