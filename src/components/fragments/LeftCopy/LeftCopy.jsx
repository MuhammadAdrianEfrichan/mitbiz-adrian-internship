const LeftCopy = ({
    title = 'Mulai Kelola Bisnis Lebih Cerdas Hari Ini',
    description = 'Dafarkan bisnis Anda dan nikmati sistem kasir multi-cabang yang terintegrasi penuh dalam hitungan menit.',
    badges = ['Transaksi Real-time', 'Manajemen Stok Otomatis', 'Laporan Per Cabang'],
}) => {
    return (
        <div className="w-full max-w-[620px] text-white lg:pr-8">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-[4rem] lg:leading-[1.05]">
                {title}
            </h1>

            <p className="mt-6 max-w-[520px] text-base text-blue-100 sm:text-lg">
                {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
                {badges.map((badge) => (
                    <span
                        key={badge}
                        className="rounded-full border border-blue-300/80 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm"
                    >
                        {badge}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default LeftCopy;