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
  FiLogOut,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import logo from '../../../../assets/image.png'
import { useLocation, useNavigate } from "react-router-dom";

const menuGroups = [
  {
    title: "Dashboard",
    items: [
      { label: "Dashboard", icon: FiGrid, path: "/home-admin" },
      { label: "Laporan", icon: FiFileText, path: "/laporan-admin" },
      { label: "Shift Kasir", icon: FiClock },
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
      { label: "Stok", icon: FiBox },
      { label: "Penyesuaian Stok", icon: FiShoppingBag },
    ],
  },
  {
    title: "Pengaturan",
    items: [
      { label: "Pengaturan", icon: FiSettings },
      { label: "Riwayat Transaksi", icon: FiBarChart2 },
    ],
  },
];

const SidebarAdmin = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { children } = props;

  const isCurrentPath = (path) => {
    if (!path) return false;
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] text-slate-800">
        <aside className="w-70 h-screen bg-[#f5f5f5] border-r border-slate-200 flex flex-col justify-between px-4 py-5 shadow-sm">
      <div>
        <div className="absolute z-10 top-1 w-[50%]">
            <img src={logo} alt="Mitbiz" className="h-13 w-auto" />
        </div>

        <nav className="space-y-6 pt-15">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              {group.title !== "Dashboard" && (
                <h2 className="px-3 text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wide">
                  {group.title}
                </h2>
              )}

              <ul className="space-y-1">
                {group.items.map(({ label, icon: Icon, path }) => {
                  const active = isCurrentPath(path);

                  return (
                    <li key={label}>
                      <button
                        onClick={() => path && navigate(path)}
                        type="button"
                        className={[
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.96rem] font-medium transition-all duration-200 cursor-pointer",
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

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
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

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            aria-label="Keluar"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
      
    </aside>
    {children}
    </div>
    
  );
};

export default SidebarAdmin;