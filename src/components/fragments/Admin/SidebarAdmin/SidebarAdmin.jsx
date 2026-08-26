import {
  FiBarChart2,
  FiBriefcase,
  FiBox,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiLayers,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import logo from '../../../../assets/image.png'
import { useLocation, useNavigate } from "react-router-dom";

import ProfileCard from "../ProfileCard";
import UseAuth from "../../../hooks/UseAuth";
import { getUserPermissions, getUserRole } from "../../../../utils/authorization";

const menuGroups = [
  {
    title: "Dashboard",
    items: [
      { label: "Dashboard", icon: FiGrid, path: "/home-admin" },
      { label: "Laporan", icon: FiFileText, path: "/laporan-admin" },
      { label: "Shift Kasir", icon: FiClock, path: "/shift-kasir-admin" },
    ],
  },
  {
    title: "Master Data",
    items: [
      { label: "Cabang", icon: FiBriefcase, path: "/cabang-admin" },
      { label: "Kasir", icon: FiUsers, path: "/kasir-admin" },
      { label: "Produk", icon: FiPackage, path: "/produk-admin" },
      { label: "Kategori", icon: FiLayers, path: "/kategori-admin" },
      { label: "Metode Pembayaran", icon: FiCreditCard, path: "/metode-pembayaran-admin" },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Stok", icon: FiBox, path:'/stok-admin' },
      { label: "Penyesuaian Stok", icon: FiShoppingBag, path:'/penyesuaian-stok-admin' },
    ],
  },
  {
    title: "Pengaturan",
    items: [
      { label: "Pengaturan", icon: FiSettings, path: '/pengaturan-admin' },
      { label: "Riwayat Transaksi", icon: FiBarChart2, path: '/riwayat-transaksi-admin' },
    ],
  },
];

const SidebarAdmin = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { children } = props;
  const { user } = UseAuth();
  const role = getUserRole(user);
  const permissions = getUserPermissions(user);
  const permissionByPath = {
    "/home-admin": "MENU_DASHBOARD", "/laporan-admin": "MENU_REPORT", "/shift-kasir-admin": "MENU_SHIFT",
    "/cabang-admin": "MENU_CABANG", "/kasir-admin": "MENU_STAFF", "/produk-admin": "MENU_PRODUCT",
    "/kategori-admin": "MENU_CATEGORY", "/metode-pembayaran-admin": "MENU_PAYMENT", "/stok-admin": "MENU_STOCK",
    "/penyesuaian-stok-admin": "MENU_STOCK_ADJUSTMENT", "/pengaturan-admin": "MENU_SETTING",
    "/riwayat-transaksi-admin": "MENU_TRANSACTION_HISTORY",
  };
  const canAccess = (path) => role === "ADMIN" || !permissionByPath[path] || permissions.includes(permissionByPath[path]);

  const isCurrentPath = (path) => {
    if (!path) return false;
    return location.pathname.toLowerCase() === path.toLowerCase();
  };
  
  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-[#f3f4f6] text-slate-800">
        <aside className="w-70 h-screen shrink-0 overflow-hidden bg-[#f5f5f5] border-r border-slate-200 flex flex-col justify-between px-4 py-4 shadow-sm">
      <div className="[direction:ltr]">
        <div className="mb-2 flex h-12 items-start px-3">
            <img src={logo} alt="Mitbiz" className="h-12 w-auto" />
        </div>

        <nav className="space-y-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {group.title !== "Dashboard" && (
                <h2 className="px-3 text-[0.78rem] font-semibold text-slate-500 uppercase tracking-wide">
                  {group.title}
                </h2>
              )}

              <ul className="space-y-1">
                {group.items.filter(({ path }) => canAccess(path)).map(({ label, icon: Icon, path }) => {
                  const active = isCurrentPath(path);

                  return (
                    <li key={label}>
                      <button
                        onClick={() => path && navigate(path)}
                        type="button"
                        className={[
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[0.94rem] font-medium transition-all duration-200 cursor-pointer",
                          active
                            ? "bg-[#EAF2FF] text-[#0a5cb3] shadow-sm"
                            : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900",
                        ].join(" ")}
                      >
                        <span className={[
                          "flex h-6 w-6 items-center justify-center rounded-md",
                          active ? "bg-white text-[#0a5cb3]" : "text-slate-600",
                        ].join(" ")}>
                          <Icon size={17} />
                        </span>
                        <span className="flex-1">{label}</span>
                        {active && <FiChevronRight size={16} className="text-[#0a5cb3]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#d9e9ff] to-[#b9d1f3] text-sm font-semibold text-slate-700">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Admin</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>

        <LogoutButton />
        </div>
      </div> */}
      <div className="[direction:ltr]">
        <ProfileCard />
      </div>
      
    </aside>
    {children}
    </div>
    
  );
};

export default SidebarAdmin;