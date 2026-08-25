
const QueueNumberModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-10 w-[400px] text-center shadow-xl">
                <p className="text-gray-500 text-lg mb-2">Nomor Antrian Anda</p>
                <h1 className="text-7xl font-extrabold text-[#0F74D7] mb-4">
                    {transaction.queueNumber ?? "-"}
                </h1>
                {transaction.customerName && (
                    <p className="text-gray-700 mb-1">Atas nama: {transaction.customerName}</p>
                )}
                {transaction.invoice && (
                    <p className="text-gray-400 text-sm mb-6">Invoice: {transaction.invoice}</p>
                )}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#0F74D7] text-white font-semibold cursor-pointer"
                >
                    Selesai
                </button>
            </div>
        </div>
    );
};

export default QueueNumberModal;