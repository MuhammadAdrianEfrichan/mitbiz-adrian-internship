import ButtonLogin from "../../../components/fragments/ButtonLogin";
import Navbar from "../../../components/fragments/User/Navbar";
import InputSearch from "../../../components/ui/InputSearch";
import ProductCard from "../../../components/fragments/User/ProductCard/ProductCard";
import { BiDetail } from "react-icons/bi";
import { PiBasket } from "react-icons/pi";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categoryProduct, getProduct } from "../../../services/Admin/product.service";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { createTransactions, getMetodePembayaran,getTransaction,getPajak } from "../../../services/User/transaction.service";
import { useNotification } from "../../../components/ui/NotificationCenter";
import PaymentModal from "../../../components/fragments/User/PaymentModal"
import { AuthContext } from "../../../context/AuthContext";
import QueueNumberModal from "../../../components/fragments/User/QueueNumberModal";

const OPEN_BILLS_STORAGE_KEY = "mitbiz-open-bills";
const QUEUE_STORAGE_KEY = "mitbiz-queue-list";

const getDiscountRate = (discount) => {
    const rate = Number(discount);
    return Number.isFinite(rate) && rate > 0 && rate <= 100 ? rate : 0;
};

const unwrapSetting = (response) => response?.data?.data ?? response?.data ?? response ?? {};
const findTaxSource = (value, visited = new Set()) => {
    if (!value || typeof value !== "object" || visited.has(value)) return {};
    visited.add(value);
    const taxKeys = ["percentage", "taxPercentage", "taxPercent", "taxRate", "rate", "pajakPercentage", "pajak"];
    if (taxKeys.some((key) => value[key] !== undefined && value[key] !== null && value[key] !== "")) return value;
    for (const key of ["tax", "taxSettings", "settings", "config", "summary", "transactionSummary", "business", "data"]) {
        const result = findTaxSource(value[key], visited);
        if (Object.keys(result).length > 0) return result;
    }
    return {};
};

const getConfiguredTaxRate = (response) => {
    const tax = findTaxSource(unwrapSetting(response));
    const taxValue = tax.percentage ?? tax.taxPercentage ?? tax.taxPercent ?? tax.rate ?? tax.taxRate ?? tax.pajakPercentage ?? tax.pajak;
    if (taxValue === undefined || taxValue === null || taxValue === "") return null;
    const enabled = tax.isEnabled ?? tax.isTaxEnabled ?? tax.taxEnabled ?? tax.isTaxActive ?? tax.enableTax ?? tax.pajakEnabled ?? true;
    const configuredTax = Number(taxValue);
    return enabled && Number.isFinite(configuredTax)
        ? (configuredTax > 1 ? configuredTax / 100 : configuredTax)
        : 0;
};

const findDiscountSource = (value, visited = new Set()) => {
    if (!value || typeof value !== "object" || visited.has(value)) return {};
    visited.add(value);
    const discountKeys = ["minPurchase", "percentage", "isEnabled"];
    if (discountKeys.some((key) => value[key] !== undefined && value[key] !== null && value[key] !== "")) return value;
    for (const key of ["discount", "discountSettings", "settings", "config", "data"]) {
        const result = findDiscountSource(value[key], visited);
        if (Object.keys(result).length > 0) return result;
    }
    return {};
};

const getConfiguredDiscount = (response) => {
    const discount = findDiscountSource(unwrapSetting(response));
    return {
        enabled: Boolean(discount.isEnabled ?? discount.discountEnabled ?? discount.isDiscountEnabled ?? false),
        percentage: Number(discount.percentage ?? discount.discountPercentage ?? 0) || 0,
        minPurchase: Number(discount.minPurchase ?? discount.minPurchaseAmount ?? 0) || 0,
    };
};

const Transaksi = () => {
    const notification = useNotification();
    const {user} = useContext(AuthContext);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [taxRate, setTaxRate] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [orderType, setOrderType] = useState("DINE_IN"); 
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [discountConfig, setDiscountConfig] = useState({ enabled: false, percentage: 0, minPurchase: 0 });
    const [lastTransaction, setLastTransaction] = useState(null);
const [showQueueModal, setShowQueueModal] = useState(false);



    const fetchProduct = async () => {
            setLoading(true);
            try {
                
                const data = await getProduct();
                // console.warn("🔥 RESPONSE Product:", data);
                // console.log("RESPONSE Product:", JSON.stringify(data, null, 2)); 
                setProduct(data.data ??[]);
                setAllProducts(data.data ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
    };
    useEffect(() => {
        fetchProduct();
    }, []); 

  useEffect(() => {
    const keyword = searchParams.get('categoryId');

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const result = keyword ? await categoryProduct(keyword) : await getProduct();
            setProduct(result.data ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchOrder();
}, [searchParams.get('categoryId')]);

    const categoryList = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => {
        const cat = p.category;
        if (cat?.id) {
            if (!map[cat.id]) {
                map[cat.id] = { id: cat.id, name: cat.name, count: 0 };
            }
            map[cat.id].count += 1;
        }
    });
    return Object.values(map);
}, [allProducts]);


useEffect(() => {
    if (!user?.outletId) return;
    const fetchInitialSettings = async () => {
        try {
            const [methodsRes, pajakRes] = await Promise.all([
                getMetodePembayaran(user.outletId),
                getPajak(),
            ]);
            setPaymentMethods(methodsRes.data ?? []);
            setTaxRate(getConfiguredTaxRate(pajakRes) ?? 0);
            setDiscountConfig(getConfiguredDiscount(pajakRes));

            if (methodsRes.data?.length > 0) {
                setSelectedPaymentMethodId(methodsRes.data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };
    fetchInitialSettings();
}, [user]);


    const activeCategory = searchParams.get('categoryId');

    const handleFilterCategory = (categoryName) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (categoryName) {
                params.set('categoryId', categoryName);
            } else {
                params.delete('categoryId');
            }
            return params;
        });
    };

    const handleAddToCart = (product) => {
    setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);

        if (existingItem) {
            return prevCart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }

        return [...prevCart, { ...product, quantity: 1 }];
    });
};

const handleIncreaseQty = (productId) => {
    setCart((prevCart) =>
        prevCart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
    );
};

const handleDecreaseQty = (productId) => {
    setCart((prevCart) =>
        prevCart
            .map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0) 
    );
};

const handleRemoveFromCart = (productId) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    notification.confirm(`Hapus ${item?.name || "produk ini"} dari keranjang?`, () => {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== productId));
        notification.success("Produk dihapus dari keranjang.");
    }, { actionLabel: "Hapus" });
};

const handleResetCart = () => {
    notification.confirm("Semua produk di keranjang akan dihapus.", () => {
        setCart([]);
        notification.success("Keranjang berhasil dikosongkan.");
    }, { actionLabel: "Kosongkan" });
};
const subTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
);
const itemDiscountTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
        const itemTotal = Number(item.price) * item.quantity;
        return sum + itemTotal * (getDiscountRate(item.discount) / 100);
    }, 0);
}, [cart]);

const globalDiscountAmount = useMemo(() => {
    if (!discountConfig.enabled) return 0;
    if (subTotal < discountConfig.minPurchase) return 0;
    const baseForDiscount = subTotal - itemDiscountTotal;
    return Math.round(baseForDiscount * (discountConfig.percentage / 100));
}, [subTotal, itemDiscountTotal, discountConfig]);

const totalDiscount = useMemo(
    () => itemDiscountTotal + globalDiscountAmount,
    [itemDiscountTotal, globalDiscountAmount]
);  

const taxableAmount = useMemo(() => subTotal - totalDiscount, [subTotal, totalDiscount]);
const taxAmount = useMemo(() => Math.round(taxableAmount * taxRate), [taxableAmount, taxRate]);
const total = useMemo(() => taxableAmount + taxAmount, [taxableAmount, taxAmount]);


    const buildTransactionPayload = (paymentStatus = "PAID") => ({
        orderType,
        customerName: customerName.trim(),
        tableNumber: tableNumber.trim(),
        ...(paymentStatus === "PAID" ? { paymentMethodId: selectedPaymentMethodId } : {}),
        subtotal: subTotal,
        globalDiscountAmount: totalDiscount,
        taxPercentage: taxRate * 100,
        taxAmount,
        totalAmount: total,
        amountPaid: paymentStatus === "OPEN" ? 0 : total,
        paymentStatus,
        items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        })),
    });

    const clearTransaction = () => {
        setCart([]);
        setCustomerName("");
        setTableNumber("");
        setShowPaymentModal(false);
    };

  const handleConfirmPayment = async () => {
    if (cart.length === 0) {
        notification.error("Keranjang kosong, tidak bisa diproses.");
        return;
    }
    if (!selectedPaymentMethodId) {
        notification.error("Pilih metode pembayaran untuk menyelesaikan transaksi.");
        return;
    }
    setSubmitting(true);
    try {
        const payload = buildTransactionPayload();
        const response = await createTransactions(payload);

        const responseData = response.data?.data ?? response.data ?? {};
        const queueNumber = responseData.queueNumber ?? null;

        const queueEntry = {
            id: responseData.id ?? responseData.transaction?.id ?? `queue-${Date.now()}`,
            queueNumber,
            invoice: responseData.invoice ?? null,
            customerName: customerName.trim(),
            tableNumber: tableNumber.trim(),
            orderType,
            total,
            items: cart.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                productId: item.id,
            })),
            createdAt: new Date().toISOString(),
        };

        // simpan ke daftar antrian lokal (dipisah dari open bill)
        const existingQueue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || "[]");
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify([...existingQueue, queueEntry]));

        setLastTransaction(queueEntry);
        clearTransaction();
        setShowQueueModal(true);
    } catch (err) {
        console.error(err);
        notification.error(err.message || "Transaksi gagal disimpan. Silakan coba lagi.");
    } finally {
        setSubmitting(false);
    }
};

const handleOpenBill = () => {
	if (cart.length === 0) {
		notification.error("Keranjang kosong, tambahkan produk terlebih dahulu.");
		return;
	}
	if (!customerName.trim() || !tableNumber.trim()) {
		notification.error("Nama pelanggan dan nomor meja wajib diisi untuk Open Bill.");
		return;
	}

	setSelectedPaymentMethodId(null);
	setSubmitting(true);
	const payload = buildTransactionPayload("OPEN");
	createTransactions(payload)
		.then((response) => {
			const responseData = response.data?.data ?? response.data ?? {};
			const billId = responseData.id ?? responseData.transaction?.id ?? `local-${Date.now()}`;
			const queueNumber = responseData.queueNumber ?? null;

			const bill = {
				...payload,
				id: billId,
				invoice: responseData.invoice ?? responseData.transaction?.invoice,
				total,
				subTotal,
				totalDiscount,
				taxAmount,
				createdAt: new Date().toISOString(),
				items: cart.map((item) => ({
					...item,
					productId: item.id,
				})),
			};
			const existingBills = JSON.parse(localStorage.getItem(OPEN_BILLS_STORAGE_KEY) || "[]");
			localStorage.setItem(OPEN_BILLS_STORAGE_KEY, JSON.stringify([...existingBills, bill]));

			// Open Bill tetap masuk ke Antrian, terpisah dari status pembayarannya.
			// Antrian ini baru hilang saat kasir menekan "Selesai Dilayani" di halaman Home,
			// bukan saat tagihan dibayar lewat Table Management — sama seperti pelanggan yang bayar langsung.
			const queueEntry = {
				id: billId,
				queueNumber,
				invoice: responseData.invoice ?? null,
				customerName: customerName.trim(),
				tableNumber: tableNumber.trim(),
				orderType,
				total,
				items: cart.map((item) => ({
					name: item.name,
					quantity: item.quantity,
					productId: item.id,
				})),
				createdAt: new Date().toISOString(),
			};
			const existingQueue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || "[]");
			localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify([...existingQueue, queueEntry]));

			clearTransaction();
			notification.success("Open Bill berhasil disimpan.");
		})
		.catch((err) => notification.error(err.message || "Open Bill gagal disimpan."))
		.finally(() => setSubmitting(false));
};


    return (
        <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />
            <div className="flex gap-8 px-6 pb-10 pt-24">
                <div className="mt-10 w-[70%]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-black text-2xl font-bold">Pilih Produk</h3>
                            <div className="text-sm text-gray-500 mt-1">Pilih produk yang ingin ditambahkan ke transaksi</div>
                        </div>
                        <InputSearch
                            type="text"
                            className="w-100 rounded-xl border border-slate-300 bg-gray-100 px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:pl-5"
                            placeholder="Cari Produk atau SKU..."
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <button
                            type="button"
                            onClick={() => handleFilterCategory(null)}
                            className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium shadow ${
                                !activeCategory
                                    ? "bg-white border border-gray-200"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            Semua
                            <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
                                {allProducts.length}
                            </span>
                        </button>

                        {categoryList.map(({ id, name, count }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleFilterCategory(id)}
                                className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium shadow ${
                                    activeCategory === id
                                        ? "bg-white border border-gray-200 shadow"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {name}
                                <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">{count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Product grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {product.map((p) => (
                            <ProductCard
                                key={p.id}
                                image={p.imageUrl}
                                title={p.name}
                                sku={p.sku}
                                price={p.price}
                                discount={p.discount}
                                onClick={() => handleAddToCart(p)}
                            />
                            
                        ))}
                    </div>
                </div>

                {/* Sidebar / Detail Transaksi */}
               <div className="w-[30%] border border-gray-400 mt-10 h-180 rounded-2xl fixed right-0 bg-white overflow-y-auto">
    <div className="flex items-center justify-between py-5 px-10 border-b border-gray-300">
        <div className="flex text-2xl gap-5 font-bold">
            <BiDetail className="w-8 h-8" />
            <h3>Detail Transaksi ({cart.length})</h3>
        </div>
        {cart.length > 0 && (
            <button
                onClick={handleResetCart}
                className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer"
            >
                <FiRefreshCw size={20} /> <span className="text-xl">Reset</span>
            </button>
        )}
    </div>

    {cart.length === 0 ? (
        <div className="flex flex-col gap-5 py-20 justify-center items-center text-gray-600">
            <PiBasket className="w-10 h-10" />
            <h3 className="text-xl">Keranjang Kosong</h3>
        </div>
    ) : (
        <div className="flex flex-col gap-4 p-5">
            {cart.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                {getDiscountRate(item.discount) > 0 ? (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-400 line-through">
                                            Rp{Number(item.price).toLocaleString("id-ID")}
                                        </span>
                                        <span className="rounded-md bg-red-100 px-2 py-1 font-semibold text-red-600">
                                            -{getDiscountRate(item.discount)}%
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400">
                                        Rp{Number(item.price).toLocaleString("id-ID")}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button onClick={() => handleRemoveFromCart(item.id)}>
                            <FiTrash2 className="text-orange-500 cursor-pointer" size={20}/>
                        </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <span>
                            Rp{(
                                (Number(item.price) -
                                    (Number(item.price) * getDiscountRate(item.discount)) / 100) *
                                item.quantity
                            ).toLocaleString("id-ID")}
                        </span>
                        <div className="flex items-center gap-2 border rounded-lg px-2">
                            <button onClick={() => handleIncreaseQty(item.id)} className="cursor-pointer">+</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleDecreaseQty(item.id)} className="cursor-pointer">-</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )}

    <div className="border flex flex-col gap-5 p-5 mx-5 rounded-xl">
        <div className="flex justify-between">
            <span>Sub Total</span>
            <span>Rp{subTotal.toLocaleString("id-ID")}</span>
        </div>
        {globalDiscountAmount > 0 && (
    <div className="flex justify-between text-red-600">
        <span>Diskon {discountConfig.percentage}% (min. Rp{discountConfig.minPurchase.toLocaleString("id-ID")})</span>
        <span>-Rp{globalDiscountAmount.toLocaleString("id-ID")}</span>
    </div>
)}
        <div className="flex justify-between">
            <span>Pajak {(taxRate * 100).toFixed(0)}%</span>
            <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
        </div>
        <hr />
        <div className="flex justify-between font-bold text-2xl py-3">
            <span>Total</span>
            <span>Rp{total.toLocaleString("id-ID")}</span>
        </div>
    </div>

    <div className="mx-5 mt-5">
    <ButtonLogin type="" disabled={cart.length === 0} onClick={() => setShowPaymentModal(true)}>
        Proses Pembayaran
    </ButtonLogin>
</div>
</div>
            </div>
            {showPaymentModal && (
            <PaymentModal
            cart={cart}
            orderType={orderType}
            setOrderType={setOrderType}
            subTotal={subTotal}
            totalDiscount={totalDiscount}
            taxAmount={taxAmount}
            taxRate={taxRate}
            total={total}
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
            onRemoveItem={handleRemoveFromCart}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handleConfirmPayment}
            onOpenBill={handleOpenBill}
            submitting={submitting}
            customerName={customerName}
            tableNumber={tableNumber}
            onCustomerNameChange={setCustomerName}
            onTableNumberChange={setTableNumber}
        />
    )}
    {showQueueModal && (
    <QueueNumberModal
        transaction={lastTransaction}
        onClose={() => {
            setShowQueueModal(false);
            setLastTransaction(null);
        }}
    />
)}
        </div>
    );
};

export default Transaksi;