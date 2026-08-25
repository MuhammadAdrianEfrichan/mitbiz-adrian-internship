import {
	FiEdit2,
	FiMapPin,
	FiPhone,
	FiPlus,
	FiTrash2,
} from "react-icons/fi";

const businesses = [
	{
		name: "Cabang Jakarta Pusat",
		address: "Jl. Sudirman No. 123, Jakarta Pusat",
		phone: "021-12345678",
		users: 4,
		products: 8,
		revenue: "Rp 10.862.259",
		transactions: 143,
	},
	{
		name: "Cabang Jakarta Selatan",
		address: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
		phone: "021-87654321",
		users: 2,
		products: 11,
		revenue: "Rp 7.696.938",
		transactions: 120,
	},
	{
		name: "Cabang Tangerang",
		address: "Jl. BSD Raya No. 789, Tangerang",
		phone: "021-99887766",
		users: 2,
		products: 56,
		revenue: "Rp 8.375.853",
		transactions: 122,
	},
];

const BranchCard = ({ business }) => (
	<article className="min-h-120 rounded-2xl border border-slate-300 bg-[#f8fafc] p-5 shadow-sm">
		<div className="flex items-start justify-between gap-3">
			<h2 className="text-lg font-semibold text-slate-800">{business.name}</h2>
			<span className="rounded-md bg-[#1c86ef] px-2.5 py-1 text-xs font-medium text-white">
				Aktif
			</span>
		</div>

		<div className="mt-12 space-y-4 text-base text-slate-500">
			<p className="flex items-start gap-2">
				<FiMapPin className="mt-0.5 shrink-0" size={18} />
				<span>{business.address}</span>
			</p>
			<p className="flex items-center gap-2">
				<FiPhone className="shrink-0" size={18} />
				<span>{business.phone}</span>
			</p>
		</div>

		<div className="my-6 border-t border-slate-300" />

		<div className="grid grid-cols-2 gap-3 text-base">
			<div>
				<p className="text-slate-500">Pengguna</p>
				<p className="mt-2 text-lg font-medium text-slate-800">{business.users}</p>
			</div>
			<div>
				<p className="text-slate-500">Produk</p>
				<p className="mt-2 text-lg font-medium text-slate-800">{business.products}</p>
			</div>
		</div>

		<div className="mt-7 text-base">
			<p className="text-slate-500">Pendapatan (30 hari)</p>
			<p className="mt-2 text-xl font-semibold text-[#1c86ef]">{business.revenue}</p>
			<p className="mt-1 text-sm text-slate-400">{business.transactions} transaksi</p>
		</div>

		<div className="mt-7 flex items-center gap-3 border-t border-slate-300 pt-7">
			<button
				type="button"
				className="h-10 flex-1 rounded-xl border border-slate-300 bg-white text-base font-medium text-slate-600 transition hover:bg-slate-100"
			>
				Detail
			</button>
			<button
				type="button"
				aria-label={`Edit ${business.name}`}
				className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
			>
				<FiEdit2 size={18} />
			</button>
			<button
				type="button"
				aria-label={`Hapus ${business.name}`}
				className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-red-500 transition hover:bg-red-50"
			>
				<FiTrash2 size={18} />
			</button>
		</div>
	</article>
);

const ManajementBisnisSuperAdmin = () => (
	<main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5 sm:px-8">
		<header className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 className="text-2xl font-bold text-slate-800">Manajemen Cabang</h1>
				<p className="mt-1 text-sm text-slate-500">Kelola semua cabang di seluruh lokasi</p>
			</div>
			<button
				type="button"
				className="inline-flex items-center gap-2 rounded-xl bg-[#1c86ef] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1779dc]"
			>
				<FiPlus size={17} />
				Tambah Cabang
			</button>
		</header>

		<section className="mt-5 grid max-w-295 gap-5 xl:grid-cols-3" aria-label="Daftar cabang">
			{businesses.map((business) => (
				<BranchCard key={business.name} business={business} />
			))}
		</section>
	</main>
);

export default ManajementBisnisSuperAdmin;