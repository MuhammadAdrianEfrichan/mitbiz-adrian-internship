import UseDateTime from '../../../components/hooks/UseDateTime';
import Navbar from '../../../components/fragments/User/Navbar';
import { FiClock, FiDollarSign, FiPercent } from 'react-icons/fi';
import StatistikCard from '../../../components/fragments/User/StatistikCard';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getShiftActive, getShiftClose, getShiftOpen, getShiftToday } from '../../../services/shift..service';

const Home = () => {
    const now = UseDateTime();
    const navigate = useNavigate();

    const [shift, setShift] = useState(null);   
    const [stats, setStats] = useState({ discount: 0, tax: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

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

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [shiftRes, statsRes] = await Promise.all([
                getShiftActive(),
                getShiftToday(),
            ]);

            setShift(shiftRes.data?.data ?? null);
            setStats({
                discount: statsRes.data?.data?.discount ?? 0,
                tax: statsRes.data?.data?.tax ?? 0,
            });
        } catch (err) {
            console.error('Gagal mengambil data dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleMulaiShift = async () => {
        setActionLoading(true);
        try {
            const res = await getShiftOpen();
            setShift(res.data.data);
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal memulai shift';
            alert(message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAkhiriShift = async () => {
        if (!shift?.id) return;
        const confirmClose = window.confirm('Yakin ingin mengakhiri shift?');
        if (!confirmClose) return;

        setActionLoading(true);
        try {
            await getShiftClose();
            setShift(null);
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal mengakhiri shift';
            alert(message);
        } finally {
            setActionLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
                <p className="text-[#6b7280]">Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />

            <main className="px-5 pb-10 pt-24">
                <section className="flex items-center justify-between gap-6 border-b border-[#dfe3e8] pb-6">
                    <div>
                        <p className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-[#1f2937]">
                            {shift ? 'Shift Aktif' : 'Shift belum dimulai.'}
                        </p>
                        <p className="mt-2 text-[1.05rem] text-[#6b7280]">
                            {shift
                                ? `Dimulai pada ${new Date(shift.started_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                                : 'Mulai shift untuk melakukan transaksi.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <p className="text-[2.2rem] font-bold tracking-tighter text-[#111827]">{formattedTime}</p>
                            <p className="text-[1rem] text-[#6b7280]">{formattedDate}</p>
                        </div>

                        {shift ? (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleAkhiriShift}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 rounded-xl border border-[#dfe3e8] bg-white px-4 py-3 text-[1.05rem] font-semibold text-[#374151] transition hover:bg-[#f3f4f6] disabled:opacity-50"
                                >
                                    <FiClock className="text-[1.2rem]" />
                                    {actionLoading ? 'Memproses...' : 'Akhiri Shift'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBuatTransaksi}
                                    className="flex items-center gap-2 rounded-xl bg-[#0f74d7] px-4 py-3 text-[1.05rem] font-semibold text-white shadow-[0_8px_20px_rgba(15,116,215,0.25)] transition hover:bg-[#0d68c5]"
                                >
                                    Buat Transaksi Baru
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleMulaiShift}
                                disabled={actionLoading}
                                className="flex items-center gap-2 rounded-xl bg-[#0f74d7] px-4 py-3 text-[1.05rem] font-semibold text-white shadow-[0_8px_20px_rgba(15,116,215,0.25)] transition hover:bg-[#0d68c5] disabled:opacity-50"
                            >
                                <FiClock className="text-[1.2rem]" />
                                {actionLoading ? 'Memulai...' : 'Mulai Shift'}
                            </button>
                        )}
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="text-[1.9rem] font-semibold tracking-[-0.02em] text-[#111827]">
                        Statistik Hari Ini
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <StatistikCard icon={<FiPercent className="text-[1.5rem]" />} value={`Rp ${stats.discount.toLocaleString('id-ID')}`}>
                            Diskon yang diberikan
                        </StatistikCard>
                        <StatistikCard icon={<FiDollarSign className="text-[1.5rem]" />} value={`Rp ${stats.tax.toLocaleString('id-ID')}`}>
                            Total Pajak
                        </StatistikCard>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;