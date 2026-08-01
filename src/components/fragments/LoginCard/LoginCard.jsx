const LoginCard = (props) => {
    const { children, className = '', cardClassName = '' } = props;

    return (
        <div
            className={`w-full max-w-[620px] rounded-[22px] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.16)] sm:px-10 lg:px-12 ${className}`}
        >
            <div className={`flex flex-col justify-center gap-6 ${cardClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default LoginCard;