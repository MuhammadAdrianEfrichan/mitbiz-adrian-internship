import { useContext, useEffect, useMemo, useState } from "react";
import MainKasir from "../../../components/fragments/User/MainKasir"
import InputSearch from "../../../components/ui/InputSearch"
import { getTransaction } from "../../../services/User/transaction.service";
import { getBranches } from "../../../services/Admin/branch.service";
import { getSetting } from "../../../services/Admin/setting.service";
import { getMe } from "../../../services/Login/auth.service";
import { AuthContext } from "../../../context/AuthContext";
import { FiEye, FiPrinter, FiX } from "react-icons/fi";

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

const formatTanggal = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const statusLabel = (status) => ({
    PAID: "Lunas",
    PENDING: "Belum Dibayar",
    VOID: "Dibatalkan",
})[String(status ?? "").toUpperCase()] ?? status ?? "-";

const getTransactionItems = (transaction) => {
    const items = transaction.items
        ?? transaction.transactionItems
        ?? transaction.transaction_items
        ?? transaction.details
        ?? transaction.orderItems
        ?? transaction.order_items
        ?? transaction.lines
        ?? transaction.products
        ?? transaction.transactionProducts
        ?? [];
    return Array.isArray(items) ? items : [];
};

const getItemName = (item) => item.product?.name
    ?? item.productSnapshot?.name
    ?? item.productName
    ?? item.name
    ?? "Produk";
const getItemQuantity = (item) => Number(item.quantity ?? item.qty ?? item.amount ?? item.quantity_sold ?? 0);
const getItemPrice = (item) => Number(item.price
    ?? item.unitPrice
    ?? item.unit_price
    ?? item.priceAtSale
    ?? item.price_at_sale
    ?? item.sellingPrice
    ?? item.selling_price
    ?? item.product?.price
    ?? item.productSnapshot?.price
    ?? 0);
const getItemTotal = (item) => Number(item.lineTotal
    ?? item.line_total
    ?? item.totalPrice
    ?? item.total_price
    ?? item.subtotal
    ?? getItemPrice(item) * getItemQuantity(item));
const getPaymentName = (transaction) => transaction.paymentMethod?.name
    ?? transaction.paymentMethodName
    ?? (transaction.paymentMethodId ? "-" : "Open Bill");

const unwrapData = (response) => response?.data?.data ?? response?.data ?? response ?? {};
const unwrapList = (response, visited = new Set()) => {
    if (Array.isArray(response)) return response;
    if (!response || typeof response !== "object" || visited.has(response)) return [];
    visited.add(response);
    for (const key of ["data", "outlets", "branches", "items", "results"]) {
        const list = unwrapList(response[key], visited);
        if (list.length > 0 || Array.isArray(response[key])) return list;
    }
    return [];
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

const RiwayatTransaksi = ()=>{
    const { user } = useContext(AuthContext);
        const [transactions, setTransactions] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [search, setSearch] = useState("");
        const [selectedTransaction, setSelectedTransaction] = useState(null);
        const [business, setBusiness] = useState({});
        const [outlet, setOutlet] = useState({});


        const fetchTransactions = async () => {
                    setLoading(true);
                    try {
                        const data = await getTransaction();
                        setTransactions(unwrapList(data));
                    } catch (err) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };
                useEffect(() => {
                    fetchTransactions();
                }, []);

        useEffect(() => {
            const fetchInvoiceProfile = async () => {
                try {
                    const [settingResult, branchResult, meResult] = await Promise.allSettled([
                        getSetting(),
                        getBranches(),
                        getMe(),
                    ]);
                    const settingResponse = settingResult.status === "fulfilled" ? settingResult.value : {};
                    const branchResponse = branchResult.status === "fulfilled" ? branchResult.value : {};
                    const meResponse = meResult.status === "fulfilled" ? meResult.value : {};
                    const setting = unwrapData(settingResponse);
                    const me = unwrapData(meResponse);
                    const meUser = me.user ?? me.profile ?? me;
                    const outlets = unwrapList(branchResponse);
                    const meBusiness = me.business ?? me.businessProfile ?? me.company ?? meUser.business ?? meUser.businessProfile ?? meUser.company ?? {};
                    const settingBusiness = setting.business ?? setting.businessProfile ?? setting.company ?? {};
                    const businessSources = [
                        settingBusiness,
                        { businessName: setting.businessName, business_name: setting.business_name, address: setting.address, businessAddress: setting.businessAddress, phone: setting.phone },
                        setting?.settings?.business,
                        setting?.settings,
                        setting?.business,
                        meBusiness,
                        { businessName: me.businessName, business_name: me.business_name, companyName: me.companyName },
                        meUser.business,
                        meUser.businessProfile,
                        user?.business,
                    ];
                    setBusiness({
                        name: findNested(businessSources, ["businessName", "business_name", "companyName", "company_name", "name"]),
                        address: findNested(businessSources, ["address", "businessAddress", "business_address", "outletAddress", "outlet_address"]),
                        phone: findNested(businessSources, ["phone", "phoneNumber", "phone_number", "businessPhone", "outletPhone"]),
                    });
                    setOutlet(outlets.find((item) => String(item.id) === String(user?.outletId ?? meUser.outletId)) ?? meUser.outlet ?? outlets[0] ?? {});
                } catch {
                    setBusiness({});
                    setOutlet({});
                }
            };
            fetchInvoiceProfile();
        }, [user?.outletId]);

        const filteredTransactions = useMemo(() => {
            const keyword = search.trim().toLowerCase();
            if (!keyword) return transactions;

            return transactions.filter((transaction) => [
                transaction.invoiceNumber,
                transaction.customerName,
                transaction.tableNumber,
                transaction.status,
                transaction.kasir?.name,
            ].some((value) => String(value ?? "").toLowerCase().includes(keyword)));
        }, [search, transactions]);


    return <MainKasir>
        <div className="bg-white mt-10 w-full h-auto border border-gray-400 rounded-3xl p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-black text-xl font-semibold">Riwayat Pembelian</h3>
                    <p className="mt-1 text-sm text-gray-500">Daftar transaksi yang dibuat oleh kasir.</p>
                </div>
                <InputSearch
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    wrapperClassName="w-full md:w-96 lg:w-105"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-gray-100 pl-11 pr-4 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Cari invoice, pelanggan, meja..."
                />
            </div>

            <div className="overflow-x-auto py-10">
                {loading ? (
                    <p className="py-10 text-center text-gray-500">Memuat riwayat pembelian...</p>
                ) : error ? (
                    <p className="py-10 text-center text-red-500">{error}</p>
                ) : (
                <table className="min-w-275 w-full text-left text-sm">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="py-2">No.Invoice</th>
                            <th>Pelanggan / Meja</th>
                            <th>Tanggal</th>
                            <th>Subtotal</th>
                            <th>Diskon</th>
                            <th>Pajak</th>
                            <th>Total</th>
                            <th>Metode</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr><td colSpan="10" className="py-10 text-center text-gray-500">Tidak ada transaksi yang sesuai.</td></tr>
                        ) : filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-gray-200 text-gray-700">
                                <td className="py-4 font-medium text-gray-900">{transaction.invoiceNumber ?? "-"}</td>
                                <td className="py-4">
                                    <p>{transaction.customerName || "Pelanggan umum"}</p>
                                    <p className="text-xs text-gray-500">Meja {transaction.tableNumber || "-"}</p>
                                </td>
                                <td>{formatTanggal(transaction.createdAt)}</td>
                                <td>{formatRupiah(transaction.subtotal)}</td>
                                <td>{formatRupiah(transaction.globalDiscountAmount)}</td>
                                <td>{formatRupiah(transaction.taxAmount)}</td>
                                <td className="font-semibold">{formatRupiah(transaction.totalAmount)}</td>
                                <td>{transaction.paymentMethod?.name ?? (transaction.paymentMethodId ? "-" : "Open Bill")}</td>
                                <td>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${String(transaction.status).toUpperCase() === "PAID" ? "bg-emerald-100 text-emerald-700" : String(transaction.status).toUpperCase() === "VOID" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                        {statusLabel(transaction.status)}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTransaction(transaction)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-blue-600 hover:bg-blue-50"
                                    >
                                        <FiEye /> Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
                </div>
        </div>

        {selectedTransaction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="print-invoice max-h-[92vh] w-120 max-w-2xl overflow-y-auto rounded-2xl bg-white px-8 py-7 text-slate-800 shadow-xl">
                    <div className="relative border-b border-slate-200 pb-5 text-center">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Invoice</p>
                        <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900">{findNested(selectedTransaction.business, ["businessName", "business_name", "companyName", "company_name", "name"]) || business.name || "Nama Bisnis"}</h2>
                        <p className="mt-1 text-sm text-slate-500">{findNested(selectedTransaction.business, ["address", "businessAddress", "business_address", "outletAddress", "outlet_address"]) || business.address || "Alamat bisnis"}</p>
                        <p className="text-sm text-slate-500">{findNested(selectedTransaction.business, ["phone", "phoneNumber", "phone_number", "businessPhone"]) || business.phone || "-"}</p>
                        <button type="button" onClick={() => setSelectedTransaction(null)} className="print-hidden absolute right-0 top-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="border-b border-slate-200 py-4 text-center text-sm">
                        <p className="font-semibold text-slate-800">{selectedTransaction.outlet?.name ?? selectedTransaction.outletName ?? outlet.name ?? "Outlet"}</p>
                        <p className="mt-1 text-slate-500">{selectedTransaction.outlet?.address ?? outlet.address ?? "Alamat outlet belum tersedia"}</p>
                        <p className="text-slate-500">{selectedTransaction.outlet?.phone ?? outlet.phone ?? outlet.phoneNumber ?? "-"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 py-4 text-sm">
                        <div><p className="text-slate-500">Invoice</p><p>{selectedTransaction.invoiceNumber ?? "-"}</p></div>
                        <div><p className="text-slate-500">Tanggal</p><p>{formatTanggal(selectedTransaction.createdAt)}</p></div>
                        <div><p className="text-slate-500">Kasir</p><p>{selectedTransaction.kasir?.name ?? user?.name ?? "-"}</p></div>
                        <div><p className="text-slate-500">Pembayaran</p><p>{getPaymentName(selectedTransaction)}</p></div>
                        <div><p className="text-slate-500">Pelanggan</p><p>{selectedTransaction.customerName || "Pelanggan umum"}</p></div>
                        <div><p className="text-slate-500">Meja</p><p>{selectedTransaction.tableNumber || "-"}</p></div>
                    </div>

                    <div className="py-5">
                        <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_6.5rem_6.5rem] items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">
                            <span>Item</span><span>Qty</span><span>Harga</span><span className="text-right">Total</span>
                        </div>
                        {getTransactionItems(selectedTransaction).map((item, index) => (
                            <div key={item.id ?? index} className="grid grid-cols-[minmax(0,1fr)_3.5rem_6.5rem_6.5rem] items-center gap-2 border-b border-slate-100 px-3 py-3 text-sm">
                                <span className="min-w-0 truncate" title={getItemName(item)}>{getItemName(item)}</span>
                                <span>{getItemQuantity(item)}</span>
                                <span className="whitespace-nowrap">{formatRupiah(getItemPrice(item))}</span>
                                <span className="whitespace-nowrap text-right">{formatRupiah(getItemTotal(item))}</span>
                            </div>
                        ))}
                    </div>

                    <div className="ml-auto w-full max-w-md space-y-2 border-t border-slate-200 pt-4 text-sm">
                        <div className="flex justify-between"><span>Subtotal:</span><span>{formatRupiah(selectedTransaction.subtotal)}</span></div>
                        <div className="flex justify-between text-red-600"><span>Diskon:</span><span>-{formatRupiah(selectedTransaction.globalDiscountAmount)}</span></div>
                        <div className="flex justify-between"><span>Pajak:</span><span>{formatRupiah(selectedTransaction.taxAmount)}</span></div>
                        <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><span>Total:</span><span>{formatRupiah(selectedTransaction.totalAmount)}</span></div>
                    </div>

                    <div className="print-hidden mt-6 flex gap-3">
                        <button type="button" onClick={() => window.print()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
                            <FiPrinter /> Cetak
                        </button>
                        <button type="button" onClick={() => setSelectedTransaction(null)} className="flex-1 rounded-xl border border-slate-200 py-3 font-medium hover:bg-slate-50">Tutup</button>
                    </div>
                </div>
            </div>
        )}
        
    </MainKasir>
}

export default RiwayatTransaksi