import { FiChevronDown } from "react-icons/fi";

const FilterSection = () => {
  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 mb-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Periode */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Periode
          </label>

          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-xl bg-gray-100 px-4 pr-10 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-500">
              <option>30 Hari Terakhir</option>
              <option>7 Hari Terakhir</option>
              <option>90 Hari Terakhir</option>
              <option>1 Tahun</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
          </div>
        </div>

        {/* Cabang */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Cabang
          </label>

          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-xl bg-gray-100 px-4 pr-10 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-500">
              <option>Semua Cabang</option>
              <option>Cabang Padang</option>
              <option>Cabang Bukittinggi</option>
              <option>Cabang Solok</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Kategori
          </label>

          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-xl bg-gray-100 px-4 pr-10 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-blue-500">
              <option>Produk Terlaris</option>
              <option>Pendapatan</option>
              <option>Stok</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;