import UseDateTime from '../../../components/hooks/UseDateTime';
import Navbar from '../../../components/fragments/User/Navbar';
import { FiClock, FiDollarSign, FiPercent } from 'react-icons/fi';
import StatistikCard from '../../../components/fragments/User/StatistikCard';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getShiftActive, getShiftClose, getShiftOpen, getShiftToday } from '../../../services/shift..service';
import { useNotification } from '../../../components/ui/NotificationCenter';
import { createTransactions, getMetodePembayaran, getTransaction } from '../../../services/transaction.service';
import { AuthContext } from '../../../context/AuthContext';
import { FiEye, FiX } from 'react-icons/fi';

const OPEN_BILLS_STORAGE_KEY = "mitbiz-open-bills";
const PAID_OPEN_BILLS_STORAGE_KEY = "mitbiz-paid-open-bills";
const OPEN_BILLS_MIGRATION_KEY = "mitbiz-open-bills-migration-v2";

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`;
const getBillTotal = (bill) => bill.total ?? bill.totalAmount ?? bill.amount ?? 0;

const isOpenBill = (transaction) => {
    const status = String(transaction.paymentStatus ?? transaction.status ?? '').toUpperCase();
    return status === 'OPEN' || status === 'UNPAID' || status === 'PENDING';
};

const Home = () => {
    const notification = useNotification();
    const { user } = useContext(AuthContext);
    const now = UseDateTime();
    const navigate = useNavigate();

    const [shift, setShift] = useState(null);   
    const [stats, setStats] = useState({ discount: 0, tax: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [openBills, setOpenBills] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
    const [billLoading, setBillLoading] = useState(false);

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
            console.log("SHIFT ACTIVE RESPONSE:", JSON.stringify(shiftRes, null, 2));
            setShift(shiftRes.data ?? null);
            setStats({
                discount: statsRes.data?.discount ?? 0,
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

    useEffect(() => {
        const fetchOpenBills = async () => {
            setBillLoading(true);
            const storedMigrationTimestamp = localStorage.getItem(OPEN_BILLS_MIGRATION_KEY);
            const migrationTimestamp = storedMigrationTimestamp || String(Date.now());
            if (!storedMigrationTimestamp) {
                localStorage.setItem(OPEN_BILLS_MIGRATION_KEY, migrationTimestamp);
            }
            const localBills = JSON.parse(localStorage.getItem(OPEN_BILLS_STORAGE_KEY) || "[]")
                .filter((bill) => !migrationTimestamp || new Date(bill.createdAt).getTime() > Number(migrationTimestamp));
            const paidBillIds = JSON.parse(localStorage.getItem(PAID_OPEN_BILLS_STORAGE_KEY) || "[]");
            try {
                const [transactionsRes, methodsRes] = await Promise.all([
                    getTransaction(),
                    user?.outletId ? getMetodePembayaran(user.outletId) : Promise.resolve({ data: [] }),
                ]);
                const serverBills = (transactionsRes.data ?? [])
                    .filter(isOpenBill)
                    .filter((bill) => !paidBillIds.includes(bill.id))
                    .filter((bill) => !migrationTimestamp || new Date(bill.createdAt).getTime() > Number(migrationTimestamp));
                const bills = [...localBills, ...serverBills.filter((bill) => !localBills.some((local) => local.id === bill.id))];
                setOpenBills(bills);
                setPaymentMethods(methodsRes.data ?? []);
                setSelectedPaymentMethodId(methodsRes.data?.[0]?.id ?? null);
            } catch (err) {
                setOpenBills(localBills);
                if (!localBills.length) notification.error(err.message || 'Gagal mengambil tagihan terbuka.');
            } finally {
                setBillLoading(false);
            }
        };

        fetchOpenBills();
    }, [user?.outletId]);

    const handlePayBill = async () => {
        if (!selectedBill || !selectedPaymentMethodId) {
            notification.error('Pilih metode pembayaran terlebih dahulu.');
            return;
        }

        setActionLoading(true);
        try {
            await createTransactions({
                orderType: selectedBill.orderType,
                customerName: selectedBill.customerName,
                tableNumber: selectedBill.tableNumber,
                paymentMethodId: selectedPaymentMethodId,
                amountPaid: getBillTotal(selectedBill),
                paymentStatus: 'PAID',
                items: (selectedBill.items ?? []).map((item) => ({
                    productId: item.productId ?? item.id,
                    quantity: item.quantity,
                })),
            });
            const paidBillIds = JSON.parse(localStorage.getItem(PAID_OPEN_BILLS_STORAGE_KEY) || "[]");
            localStorage.setItem(PAID_OPEN_BILLS_STORAGE_KEY, JSON.stringify([...new Set([...paidBillIds, selectedBill.id])]));
            const remainingBills = openBills.filter((bill) => bill.id !== selectedBill.id);
            localStorage.setItem(OPEN_BILLS_STORAGE_KEY, JSON.stringify(remainingBills.filter((bill) => String(bill.id).startsWith('local-'))));
            setOpenBills(remainingBills);
            setSelectedBill(null);
            notification.success('Tagihan berhasil dibayar.');
        } catch (err) {
            notification.error(err.message || 'Pembayaran tagihan gagal.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMulaiShift = async () => {
        setActionLoading(true);
        try {
            const res = await getShiftOpen();
            setShift(res.data ?? null);
            notification.success("Shift berhasil dimulai.");
        } catch (err) {
            const message = err.message || 'Gagal memulai shift';
            notification.error(message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAkhiriShift = async () => {
        if (!shift?.id) return;
        notification.confirm('Transaksi baru tidak dapat dilakukan setelah shift diakhiri.', async () => {
            setActionLoading(true);
            try {
                await getShiftClose(shift.id);
                setShift(null);
                notification.success("Shift berhasil diakhiri.");
            } catch (err) {
                const message = err.message || 'Gagal mengakhiri shift';
                notification.error(message);
                console.log(err.message);
            } finally {
                setActionLoading(false);
            }
        }, { actionLabel: "Akhiri shift" });
    };
    const handleBuatTransaksi = () => {
    if (!shift) return;
    navigate('/transaksi-kasir');
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

                <section className="mt-8 border-t border-[#dfe3e8] pt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[1.9rem] font-semibold tracking-[-0.02em] text-[#111827]">Table Management</h2>
                            <p className="mt-1 text-[#6b7280]">Tagihan pelanggan yang belum dibayar</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">{openBills.length} tagihan</span>
                    </div>

                    {billLoading ? (
                        <p className="mt-5 text-[#6b7280]">Memuat tagihan...</p>
                    ) : openBills.length === 0 ? (
                        <p className="mt-5 rounded-xl border border-dashed border-[#cbd5e1] bg-white p-6 text-[#6b7280]">Belum ada tagihan terbuka.</p>
                    ) : (
                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {openBills.map((bill, index) => (
                                <article key={bill.id ?? `${bill.tableNumber}-${index}`} className="rounded-xl border border-[#dfe3e8] bg-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">Meja {bill.tableNumber || '-'}</h3>
                                            <p className="text-sm text-[#6b7280]">{bill.customerName || 'Pelanggan umum'}</p>
                                        </div>
                                        <span className="h-3 w-3 rounded-full bg-orange-400" title="Belum dibayar" />
                                    </div>
                                    <p className="mt-3 text-sm text-[#6b7280]">{(bill.items ?? []).map((item) => `${item.name ?? item.productName ?? 'Produk'} x${item.quantity}`).join(', ')}</p>
                                    <div className="mt-3 border-t border-[#e5e7eb] pt-3">
                                        <p className="text-sm text-[#6b7280]">Total</p>
                                        <p className="text-2xl font-bold">{formatRupiah(getBillTotal(bill))}</p>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button type="button" onClick={() => setSelectedBill(bill)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] px-3 py-2 text-sm font-medium hover:bg-slate-50">
                                            <FiEye /> Detail
                                        </button>
                                        <button type="button" onClick={() => setSelectedBill(bill)} className="flex-1 rounded-xl bg-[#0f74d7] px-3 py-2 text-sm font-medium text-white hover:bg-[#0d68c5]">Tagih Sekarang</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6">
                        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
                            <div>
                                <h2 className="text-xl font-bold">Detail Tagihan</h2>
                                <p className="text-sm text-[#6b7280]">{selectedBill.customerName || 'Pelanggan umum'} · Meja {selectedBill.tableNumber || '-'}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedBill(null)}><FiX className="h-5 w-5" /></button>
                        </div>
                        <div className="my-5 space-y-3">
                            {(selectedBill.items ?? []).map((item, index) => (
                                <div key={item.id ?? index} className="flex justify-between border-b border-[#f1f5f9] pb-3 text-sm">
                                    <span>{item.name ?? item.productName ?? 'Produk'} x{item.quantity}</span>
                                    <span>{formatRupiah((item.price ?? 0) * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between border-t border-[#e5e7eb] pt-4 text-lg font-bold">
                            <span>Total</span><span>{formatRupiah(getBillTotal(selectedBill))}</span>
                        </div>
                        <label className="mt-5 block text-sm font-medium text-[#374151]">
                            Metode Pembayaran
                            <select value={selectedPaymentMethodId ?? ''} onChange={(event) => setSelectedPaymentMethodId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#cbd5e1] px-3 py-3">
                                <option value="" disabled>Pilih metode pembayaran</option>
                                {paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
                            </select>
                        </label>
                        <button type="button" onClick={handlePayBill} disabled={actionLoading || !selectedPaymentMethodId} className="mt-5 w-full rounded-xl bg-[#0f74d7] py-3 font-medium text-white disabled:opacity-50">
                            {actionLoading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;