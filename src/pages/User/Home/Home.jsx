import UseDateTime from '../../../components/fragments/UseDateTime';
import Navbar from '../../../components/fragments/User/Navbar';
import { FiClock, FiDollarSign, FiPercent } from 'react-icons/fi';

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

            <main className=" px-5 pb-10 pt-8">
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
                        <div className="rounded-[1.25rem] border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-[1.1rem] font-semibold text-[#111827]">Diskon diberikan</h3>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#374151]">
                                    <FiPercent className="text-[1.5rem]" />
                                </div>
                            </div>

                            <p className="mt-8 text-[2.9rem] font-bold leading-none tracking-[-0.06em] text-[#111827]">
                                Rp 0
                            </p>
                            <p className="mt-3 text-[1rem] text-[#6b7280]">Diskon diberikan</p>
                        </div>

                        <div className="rounded-[1.25rem] border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-[1.1rem] font-semibold text-[#111827]">Total Pajak</h3>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#374151]">
                                    <FiDollarSign className="text-[1.5rem]" />
                                </div>
                            </div>

                            <p className="mt-8 text-[2.9rem] font-bold leading-none tracking-[-0.06em] text-[#111827]">
                                Rp 0
                            </p>
                            <p className="mt-3 text-[1rem] text-[#6b7280]">Pajak dikumpulkan</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;