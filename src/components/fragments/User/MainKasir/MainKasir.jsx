import Navbar from "../Navbar";

const MainKasir = (props)=>{
    const {children} = props;
    return (
        <div className=" px-6 min-h-screen bg-[#f5f6f8] text-[#111827]">
        <Navbar />
        {children}
        </div>
    );
}

export default MainKasir