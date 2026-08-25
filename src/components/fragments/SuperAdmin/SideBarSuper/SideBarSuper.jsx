import {
    FiBarChart2,
    FiBriefcase,
    FiCreditCard,
    FiFileText,
    FiGrid,
    FiSettings,
    FiUsers,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../../assets/image.png";

import ProfileCard from "../../Admin/ProfileCard";

const menuItems = [
    { label: "Dashboard", icon: FiGrid, path: "/dashboard-superadmin" },
    { label: "Manajemen Bisnis", icon: FiBriefcase, path: "/manajementbisnis-superadmin" },
    { label: "Manajemen User", icon: FiUsers, path: "/user-superadmin" },
    { label: "Paket Langganan", icon: FiCreditCard, path: "/paket-langganan-super-admin" },
    { label: "Laporan", icon: FiFileText, path: "/laporan-super-admin" },
    { label: "Pengaturan", icon: FiSettings, path: "/pengaturan-super-admin" },
];

const SideBarSuper = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#f3f4f6] text-slate-800">
            <aside className="flex h-screen w-70 flex-col justify-between border-r border-slate-200 bg-[#f5f5f5] px-4 py-5 shadow-sm">
                <div>
                    <div className="absolute top-1 z-10 w-[50%]">
                        <img src={logo} alt="Mitbiz" className="h-13 w-auto" />
                    </div>

                    <nav className="space-y-2 pt-15">
                        <h2 className="px-3 text-[0.8rem] font-semibold text-slate-500">
                            Dashboard
                        </h2>

                        <ul className="space-y-1">
                            {menuItems.map(({ label, icon: Icon, path }) => {
                                const active = location.pathname.toLowerCase() === path.toLowerCase();

                                return (
                                    <li key={label}>
                                        <button
                                            onClick={() => navigate(path)}
                                            type="button"
                                            className={[
                                                "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.96rem] font-medium transition-all duration-200",
                                                active
                                                    ? "bg-[#EAF2FF] text-[#0a5cb3] shadow-sm"
                                                    : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900",
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "flex h-6 w-6 items-center justify-center rounded-md",
                                                    active ? "bg-white text-[#0a5cb3]" : "text-slate-600",
                                                ].join(" ")}
                                            >
                                                <Icon size={17} />
                                            </span>
                                            <span className="flex-1">{label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <ProfileCard />
            </aside>
            {children}
        </div>
    );
};

export default SideBarSuper