const StatistikCard = (props)=>{
    const {children, icon}=props;
    return(
            <div className="rounded-[1.25rem] border border-[#dfe3e8] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[1.1rem] font-semibold text-[#111827]">{children}</h3>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#374151]">
                    {/* <FiPercent className="text-[1.5rem]" /> */}
                    {icon}
                    </div>
            </div>
            
            <p className="mt-8 text-[2.9rem] font-bold leading-none tracking-[-0.06em] text-[#111827]">
                {/*bagian ini akan di kirimkan props sesuai kebutuhan  */}
            Rp 0
            </p>
            <p className="mt-3 text-[1rem] text-[#6b7280]">{children}</p>
            </div>
    )
}

export default StatistikCard