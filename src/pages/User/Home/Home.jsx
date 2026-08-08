import UseDateTime from '../../../components/hooks/UseDateTime';
import Navbar from '../../../components/fragments/User/Navbar';
import { FiClock, FiDollarSign, FiPercent } from 'react-icons/fi';
import StatistikCard from '../../../components/fragments/User/StatistikCard';

const Home = () => {
    const now = UseDateTime();
    const formattedDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    });
    return (
        <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />

            <main className="px-5 pb-10 pt-24">
                <section className="flex items-center justify-between gap-6 border-b border-[#dfe3e8] pb-6">
                    <div>
                        <p className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-[#1f2937]">
                            Shift belum dimulai.
                        </p>
                        <p className="mt-2 text-[1.05rem] text-[#6b7280]">
                            Mulai shift untuk melakukan transaksi.
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <p className="text-[2.2rem] font-bold tracking-tighter text-[#111827]">{formattedTime}</p>
                            <p className="text-[1rem] text-[#6b7280]">{formattedDate}</p>
                        </div>

                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-xl bg-[#0f74d7] px-4 py-3 text-[1.05rem] font-semibold text-white shadow-[0_8px_20px_rgba(15,116,215,0.25)] transition hover:bg-[#0d68c5]"
                        >
                            <FiClock className="text-[1.2rem]" />
                            Mulai Shift
                        </button>
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="text-[1.9rem] font-semibold tracking-[-0.02em] text-[#111827]">
                        Statistik Hari Ini
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <StatistikCard icon={<FiPercent className="text-[1.5rem]" />}>Diskon yang diberikan</StatistikCard>
                        <StatistikCard icon={<FiDollarSign className="text-[1.5rem]" />}>Total Pajak</StatistikCard>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;