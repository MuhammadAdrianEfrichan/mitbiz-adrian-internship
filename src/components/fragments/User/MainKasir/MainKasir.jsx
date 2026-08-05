import Navbar from "../Navbar";

const MainKasir = (props) => {
    const { children } = props;
    return (
        <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">
            <Navbar />
            <div className="px-6 pb-10 pt-24">
                {children}
            </div>
        </div>
    );
};

export default MainKasir;