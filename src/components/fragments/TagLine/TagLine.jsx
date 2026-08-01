const TagLine = ({ title = 'Masuk ke Mitbiz POS', subtitle = 'Kelola transaksi, stok, dan laporan dalam satu sistem terintegrasi.' }) => {
    return (
        <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-[2rem]">
                {title}
            </h2>
            <p className="text-base text-slate-500 md:text-lg">
                {subtitle}
            </p>
        </div>
    );
};

export default TagLine;