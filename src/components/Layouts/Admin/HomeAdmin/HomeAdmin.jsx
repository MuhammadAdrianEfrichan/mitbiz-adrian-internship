import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiLoader, FiSearch } from "react-icons/fi";
import { getLangganan } from "../../../../services/SuperAdmin/paketlangganan.service"; // sesuaikan path
import { subscribeToPackage } from "../../../../services/Admin/berlangganan.service"; // sesuaikan path — fungsi ini akan diisi begitu spek checkout ada
import { environment } from "../../../../constant/environment";

const formatRupiah = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value || 0);

const periodLabel = (cycle) => {
	const normalized = (cycle || "").toUpperCase();
	if (normalized === "MONTHLY") return "/Bulan";
	if (normalized === "YEARLY" || normalized === "ANNUAL") return "/Tahun";
	return cycle ? `/${cycle}` : "";
};

const normalizePlan = (item) => ({
	id: item.id,
	name: item.name,
	description: item.description,
	price: item.price,
	priceDisplay: formatRupiah(item.price),
	period: periodLabel(item.billingCycle),
	billingCycle: item.billingCycle,
	maxBranches: item.maxBranches,
	maxKasir: item.maxKasir,
	isActive: item.isActive,
	features: (item.features || []).map((f) => f.name),
});

const PlanCard = ({ plan, isPaying, onChoose, highlighted }) => (
	<article
		className={`w-full max-w-100 rounded-2xl border bg-white p-6 shadow-sm ${
			highlighted ? "border-2 border-[#1c86ef]" : "border-slate-200"
		}`}
	>
		<div className="flex items-start justify-between gap-3">
			<h2 className="text-xl font-semibold text-slate-800">{plan.name}</h2>
			{highlighted && (
				<span className="rounded-md bg-[#1c86ef] px-2.5 py-1 text-xs font-medium text-white">Rekomendasi</span>
			)}
		</div>
		<p className="mt-2 min-h-11 text-sm leading-5 text-slate-500">{plan.description}</p>
		<p className="mt-6 text-3xl font-semibold text-[#1c86ef]">{plan.priceDisplay}</p>
		<p className="text-sm text-slate-400">{plan.period}</p>
		<p className="mt-6 text-sm text-slate-600">Fitur:</p>
		<ul className="mt-2 space-y-2 text-sm text-slate-600">
			<li className="flex items-center gap-2">
				<FiCheck className="text-[#1c86ef]" size={16} />
				Maks {plan.maxBranches} Cabang
			</li>
			<li className="flex items-center gap-2">
				<FiCheck className="text-[#1c86ef]" size={16} />
				Maks {plan.maxKasir} Kasir
			</li>
			{plan.features.map((feature) => (
				<li key={feature} className="flex items-center gap-2">
					<FiCheck className="text-[#1c86ef]" size={16} />
					{feature}
				</li>
			))}
		</ul>
		<button
			type="button"
			disabled={isPaying}
			onClick={() => onChoose(plan)}
			className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1c86ef] text-sm font-medium text-white transition hover:bg-[#1779dc] disabled:opacity-60"
		>
			{isPaying ? <FiLoader className="animate-spin" size={16} /> : null}
			{isPaying ? "Memproses..." : "Pilih Paket Ini"}
		</button>
	</article>
);


const SubscriptionRequiredScreen = ({ businessId }) => {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState("");
	const [payingPlanId, setPayingPlanId] = useState(null);
	const [payError, setPayError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		getLangganan()
			.then((res) => {
				const list = res?.data ?? [];
				setPlans(list.map(normalizePlan).filter((p) => p.isActive));
			})
			.catch((err) => setError(err.message || "Gagal mengambil daftar paket"))
			.finally(() => setLoading(false));
	}, []);

	const filteredPlans = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return plans;
		return plans.filter((p) => p.name?.toLowerCase().includes(term));
	}, [plans, search]);

	const waitForSubscriptionActive = async (maxAttempts = 15, intervalMs = 2000) => {
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			await new Promise((resolve) => setTimeout(resolve, intervalMs));
			try {
				const res = await fetch(`${environment.API_URL}/subscriptions/my`, {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				if (data?.data?.hasActiveSubscription === true) {
					window.location.reload();
					return;
				}
			} catch {
				// Abaikan error sementara, lanjut polling
			}
		}
		// Timeout: webhook mungkin delay — reload saja agar user tidak stuck
		window.location.reload();
	};

	const handleChoose = async (plan) => {
	setPayError(null);
	setPayingPlanId(plan.id);
	try {
		const res = await subscribeToPackage({ packageId: plan.id });
		const { snapToken, redirectUrl } = res?.data ?? {};

		if (snapToken && window.snap) {
		window.snap.pay(snapToken, {
			onSuccess: (result) => {
				console.log("SNAP onSuccess:", result);
				// Tunggu webhook diproses dulu, baru reload
				waitForSubscriptionActive();
			},
			onPending: (result) => {
				console.log("SNAP onPending:", result);
				// Untuk pending (transfer bank dll), langsung reload saja
				window.location.reload();
			},
			onError: () => {
				setPayError("Pembayaran gagal diproses. Silakan coba lagi.");
				setPayingPlanId(null);
			},
			onClose: () => {
				// User menutup modal sebelum bayar — tidak dianggap error, cukup reset tombol.
				setPayingPlanId(null);
			},
		});
		return;
	}

		// Fallback kalau snap.js belum termuat: redirect penuh ke halaman Midtrans.
		if (redirectUrl) {
			window.location.href = redirectUrl;
			return;
		}

		throw new Error("Respons pembayaran tidak lengkap (tidak ada snapToken maupun redirectUrl).");
	} catch (err) {
		setPayError(err.message || "Gagal memproses pembayaran. Coba lagi.");
		setPayingPlanId(null);
	}
};

	return (
		<main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-8 sm:px-8">
			<div className="mx-auto max-w-4xl text-center">
				<h1 className="text-2xl font-bold text-slate-800">Aktifkan Langganan Anda</h1>
				<p className="mt-2 text-sm text-slate-500">
					Bisnis Anda belum memiliki paket aktif. Pilih paket di bawah untuk mulai menggunakan semua fitur.
				</p>
			</div>

			<div className="mx-auto mt-6 max-w-md">
				<label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400">
					<FiSearch size={16} />
					<input
						className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
						placeholder="Cari paket..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</label>
			</div>

			{loading && (
				<div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
					<FiLoader className="animate-spin" size={18} />
					<span className="text-sm">Memuat daftar paket...</span>
				</div>
			)}

			{!loading && error && <div className="mt-10 text-center text-sm text-red-500">{error}</div>}

			{!loading && !error && filteredPlans.length === 0 && (
				<div className="mt-10 text-center text-sm text-slate-400">Tidak ada paket yang cocok.</div>
			)}

			{payError && (
				<div className="mx-auto mt-4 max-w-md rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
					{payError}
				</div>
			)}

			{!loading && !error && filteredPlans.length > 0 && (
				<section className="mt-8 flex flex-wrap justify-center gap-4">
					{filteredPlans.map((plan, idx) => (
						<PlanCard
							key={plan.id}
							plan={plan}
							highlighted={idx === Math.floor(filteredPlans.length / 2)}
							isPaying={payingPlanId === plan.id}
							onChoose={handleChoose}
						/>
					))}
				</section>
			)}
		</main>
	);
};

export default SubscriptionRequiredScreen;