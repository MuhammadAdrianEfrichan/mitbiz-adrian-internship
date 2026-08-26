import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiEye, FiSearch, FiX } from "react-icons/fi";
import { getTransaction } from "../../../../services/User/transaction.service";
import { getBranches } from "../../../../services/Admin/branch.service";

const formatRupiah = (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;
const formatDate = (value) => value ? new Date(value).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
const getItems = (transaction) => transaction.items ?? transaction.transactionItems ?? transaction.details ?? [];
const getPayment = (transaction) => transaction.paymentMethod?.name ?? transaction.paymentMethodName ?? (transaction.paymentMethodId ? "-" : "Open Bill");
const getBranchName = (transaction) => transaction.outlet?.name ?? transaction.outletName ?? transaction.branch?.name ?? "-";
const getTransactionSummary = (response) => response?.data?.data ?? response?.data ?? response ?? {};
const unwrapList = (response, visited = new Set()) => {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== "object" || visited.has(response)) return [];
  visited.add(response);
  for (const key of ["data", "transactions", "results", "items", "records", "rows", "outlets"]) {
    const result = unwrapList(response[key], visited);
    if (result.length > 0 || Array.isArray(response[key])) return result;
  }
  return [];
};
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const RiwayatAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiTotal, setApiTotal] = useState(0);
  const [apiSummary, setApiSummary] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const branchResponse = await getBranches();
        const branchList = unwrapList(branchResponse);
        if (!mounted) return;
        setBranches(branchList);
        const transactionResponse = await getTransaction(branchFilter ? { outletId: branchFilter } : {});
        if (!mounted) return;
        const transactionSummary = getTransactionSummary(transactionResponse);
        const transactionList = Array.isArray(transactionSummary.transactions)
          ? transactionSummary.transactions
          : unwrapList(transactionResponse);
        setTransactions(transactionList);
        setApiTotal(Number(transactionSummary.totalTransaksi ?? transactionSummary.total ?? transactionResponse?.total ?? 0));
        setApiSummary({
          sales: Number(transactionSummary.totalPenjualan ?? transactionSummary.totalSales ?? 0),
          count: Number(transactionSummary.totalTransaksi ?? transactionList.length),
          discount: Number(transactionSummary.totalDiskon ?? 0),
          tax: Number(transactionSummary.totalPajak ?? 0),
        });
      } catch (requestError) {
        if (!mounted) return;
        setError(requestError.message || "Gagal mengambil riwayat transaksi.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [branchFilter]);

  const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
    const searchTarget = [transaction.invoiceNumber, transaction.customerName, transaction.kasir?.name, getPayment(transaction), getBranchName(transaction)].join(" ").toLowerCase();
    const branchMatch = !branchFilter || transaction.outletId === branchFilter || getBranchName(transaction) === branchFilter;
    const statusMatch = !statusFilter || String(transaction.status ?? "").toUpperCase() === statusFilter;
    return (!search || searchTarget.includes(search.toLowerCase())) && branchMatch && statusMatch;
  }), [transactions, search, branchFilter, statusFilter]);

  const summary = useMemo(() => ({
    sales: filteredTransactions.reduce((total, transaction) => total + Number(transaction.totalAmount ?? 0), 0),
    count: filteredTransactions.length,
    discount: filteredTransactions.reduce((total, transaction) => total + Number(transaction.globalDiscountAmount ?? 0), 0),
    tax: filteredTransactions.reduce((total, transaction) => total + Number(transaction.taxAmount ?? 0), 0),
  }), [filteredTransactions]);
  const displayedSummary = search || branchFilter || statusFilter || !apiSummary ? summary : {
    sales: apiSummary.sales || summary.sales,
    count: apiSummary.count,
    discount: apiSummary.discount || summary.discount,
    tax: apiSummary.tax || summary.tax,
};
  

  const exportCsv = () => {
    const headers = ["Invoice", "Tanggal", "Cabang", "Kasir", "Metode", "Subtotal", "Diskon", "Pajak", "Total", "Status"];
    const rows = filteredTransactions.map((transaction) => [transaction.invoiceNumber, transaction.createdAt, getBranchName(transaction), transaction.kasir?.name, getPayment(transaction), transaction.subtotal, transaction.globalDiscountAmount, transaction.taxAmount, transaction.totalAmount, transaction.status]);
    const blob = new Blob([[headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "riwayat-transaksi.csv"; link.click(); URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-4 gap-4">
        {[["Total Penjualan", formatRupiah(displayedSummary.sales)], ["Total Transaksi", displayedSummary.count.toLocaleString("id-ID")], ["Total Diskon", formatRupiah(displayedSummary.discount)], ["Total Pajak", formatRupiah(displayedSummary.tax)]].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.9rem] font-medium text-slate-600">{label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                <span className="text-xs">◌</span>
              </span>
            </div>
            <div className="text-[1.8rem] font-bold leading-none text-slate-800">{value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-3"><h3 className="text-[1.05rem] font-semibold text-slate-700">Daftar Transaksi</h3><button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"><FiDownload /> Export CSV</button></div>
        </div>

        <div className="mb-4 grid grid-cols-[1.5fr_1fr_1fr] gap-3">
          <label className="relative block">
            <span className="sr-only">Cari produk</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari invoice, kasir, pelanggan..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="">Semua cabang</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none">
            <option value="">Semua status</option>
            <option value="PAID">Lunas</option><option value="PENDING">Belum Dibayar</option><option value="VOID">Dibatalkan</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-700">
              <thead>
                <tr className="bg-slate-100 text-sm font-semibold text-slate-700">
                  <th className="px-4 py-3">No. Invoice</th>
                  <th className="px-4 py-3">Tanggal & Waktu</th>
                  <th className="px-4 py-3">Cabang</th>
                  <th className="px-4 py-3">Kasir</th>
                  <th className="px-4 py-3">Metode Pembayaran</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-500">Memuat transaksi...</td></tr> : error ? <tr><td colSpan="7" className="px-4 py-10 text-center text-red-500">{error}</td></tr> : filteredTransactions.length === 0 ? <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-500">{apiTotal > 0 ? `API melaporkan ${apiTotal} transaksi, tetapi tidak ada transaksi pada filter ini.` : "Tidak ada transaksi."}</td></tr> : filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 font-medium text-slate-700">{transaction.invoiceNumber ?? "-"}</td>
                    <td className="px-4 py-3">{formatDate(transaction.createdAt)}</td>
                    <td className="px-4 py-3">{getBranchName(transaction)}</td>
                    <td className="px-4 py-3">{transaction.kasir?.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {getPayment(transaction)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{formatRupiah(transaction.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-blue-400 hover:text-blue-500"
                        onClick={() => setSelectedTransaction(transaction)}
                        aria-label={`Lihat ${transaction.invoiceNumber}`}
                      >
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedTransaction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="print-admin-invoice max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"><div className="flex items-start justify-between border-b border-slate-200 pb-4"><div><p className="text-sm text-slate-500">Invoice</p><h2 className="mt-2 text-2xl font-bold">{selectedTransaction.invoiceNumber}</h2><p className="text-sm text-slate-500">{getBranchName(selectedTransaction)} · {selectedTransaction.kasir?.name ?? "-"}</p></div><button type="button" className="print-admin-hidden" onClick={() => setSelectedTransaction(null)}><FiX size={20} /></button></div><div className="grid grid-cols-2 gap-4 border-b border-slate-200 py-4 text-sm"><p>Pelanggan: {selectedTransaction.customerName || "-"}</p><p>Meja: {selectedTransaction.tableNumber || "-"}</p><p>Tanggal: {formatDate(selectedTransaction.createdAt)}</p><p>Pembayaran: {getPayment(selectedTransaction)}</p></div><div className="py-5">{getItems(selectedTransaction).map((item, index) => <div key={item.id ?? index} className="flex justify-between border-b border-slate-100 py-2 text-sm"><span>{item.product?.name ?? item.name ?? item.productName ?? "Produk"} x{item.quantity}</span><span>{formatRupiah(Number(item.price ?? item.unitPrice ?? 0) * Number(item.quantity ?? 0))}</span></div>)}</div><div className="ml-auto max-w-sm space-y-2 border-t border-slate-200 pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(selectedTransaction.subtotal)}</span></div><div className="flex justify-between"><span>Diskon</span><span>-{formatRupiah(selectedTransaction.globalDiscountAmount)}</span></div><div className="flex justify-between"><span>Pajak</span><span>{formatRupiah(selectedTransaction.taxAmount)}</span></div><div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><span>Total</span><span>{formatRupiah(selectedTransaction.totalAmount)}</span></div></div><div className="print-admin-hidden mt-6 flex gap-3"><button type="button" onClick={() => window.print()} className="flex-1 rounded-xl bg-blue-600 py-3 font-medium text-white">Cetak</button><button type="button" onClick={() => setSelectedTransaction(null)} className="flex-1 rounded-xl border border-slate-300 py-3">Tutup</button></div></div></div>}
    </div>
  );
};

export default RiwayatAdmin;