import { useNavigate } from "react-router-dom";
import UseAuth from "../../../hooks/UseAuth";
import { logout } from "../../../../services/auth.service";
import { useNotification } from "../../../ui/NotificationCenter";

const ProfileCard = ()=>{

    const { user, setUser } = UseAuth();
    const navigate = useNavigate();
    const notification = useNotification();

    const handleLogout = async () => {
        notification.confirm("Anda akan keluar dari akun ini.", async () => {
            try {
                await logout();
                setUser(null);
                notification.success("Anda berhasil logout.");
                navigate("/");
            } catch (err) {
                notification.error(err.message || "Logout gagal.");
                console.error("Logout gagal:", err);
            }
        }, { actionLabel: "Logout" });
    };

    const initial = user?.name?.charAt(0).toUpperCase() ?? "?";
    const roleLabel = user?.role === "STAFF" ? "CASHIER" : user?.role ?? "";
    return(
        <div className="flex shrink-0 items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-2 py-1.5 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2f7] text-xs font-bold text-[#111827]">
                        {initial}
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-[#111827]">{user?.name ?? "Memuat..."}</span>
                        <span className="text-[11px] text-[#6b7280]">{user?.role ?? "memuat..."}</span>
                    </div>

                    <button
                        type="button"
                        aria-label="Open user menu"
                        className="ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe3e8] bg-[#f5f7fa] text-lg text-[#374151] cursor-pointer"
                        onClick={handleLogout}
                    >
                        <span className="-translate-y-px">›</span>
                    </button>
                </div>
    )
}

export default ProfileCard