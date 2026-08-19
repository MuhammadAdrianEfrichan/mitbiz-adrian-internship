import { FiTrash2, FiX } from "react-icons/fi";
import { LuUtensils } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi";

const PaymentModal = ({
    cart,
    orderType,
    setOrderType,
    subTotal,
    totalDiscount,
    taxAmount,
    taxRate,
    total,
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    onIncreaseQty,
    onDecreaseQty,
    onRemoveItem,
    onClose,
    onConfirm,
    onOpenBill,
    submitting,
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-225 max-h-[90vh] overflow-y-auto p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Detail Pesanan</h2>
                    <button onClick={onClose}>
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* KIRI: Tipe pesanan + list item */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Tipe Pesanan</p>
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => setOrderType("DINE_IN")}
                                className={`flex-1 flex flex-col items-center cursor-pointer gap-1 py-4 rounded-xl border-2 ${
                                    orderType === "DINE_IN" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                                }`}
                            >
                                <LuUtensils className="w-6 h-6" />
                                <span className="font-medium">Makan di Tempat</span>
                                <span className="text-xs text-gray-400">Simpan pesanan pelanggan</span>
                            </button>
                            <button
                                onClick={() => setOrderType("TAKE_AWAY")}
                                className={`flex-1 flex flex-col cursor-pointer items-center gap-1 py-4 rounded-xl border-2 ${
                                    orderType === "TAKE_AWAY" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                                }`}
                            >
                                <HiOutlineShoppingBag className="w-6 h-6" />
                                <span className="font-medium">Take Away</span>
                                <span className="text-xs text-gray-400">Pesanan dibawa pulang</span>
                            </button>
                        </div>

                        <p className="text-sm font-medium mb-2">Detail Transaksi ({cart.length})</p>
                        <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                                    <div className="flex justify-between">
                                        <div className="flex gap-3">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    Rp{item.price.toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.id)}>
                                            <FiTrash2 className="text-orange-500" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span>Rp{(item.price * item.quantity).toLocaleString("id-ID")}</span>
                                        <div className="flex items-center gap-2 border rounded-lg px-2">
                                            <button onClick={() => onIncreaseQty(item.id)}>+</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => onDecreaseQty(item.id)}>-</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KANAN: Ringkasan transaksi + metode pembayaran */}
                    <div>
                        <p className="text-sm font-medium mb-3">Detail Transaksi</p>
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rp{subTotal.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span>Diskon</span>
                                <span>-Rp{totalDiscount.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pajak ({(taxRate * 100).toFixed(0)}%)</span>
                                <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Rp{total.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        <p className="text-sm font-medium mb-3">Metode Pembayaran</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedPaymentMethodId(method.id)}
                                    className={`py-3 rounded-xl border-2 font-medium ${
                                        selectedPaymentMethodId === method.id
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-gray-200 text-gray-600"
                                    }`}
                                >
                                    {method.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onConfirm}
                            disabled={!selectedPaymentMethodId || submitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 mb-3"
                        >
                            {submitting ? "Memproses..." : "Konfirmasi Pembayaran"}
                        </button>
                        <button
                            onClick={onOpenBill}
                            className="w-full border border-gray-300 py-3 rounded-xl font-medium"
                        >
                            Open Bill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;