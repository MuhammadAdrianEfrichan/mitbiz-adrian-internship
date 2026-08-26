import { useNavigate } from "react-router-dom";
import UseAuth from "../../../hooks/UseAuth";
import { logout } from "../../../../services/Login/auth.service";
import { BiLogOut } from "react-icons/bi";
import Button from "../../../ui/Button";
import { useNotification } from "../../../ui/NotificationCenter";


const ProfileCard = () => {
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
    const roleLabel = user?.role === "ADMIN" ? "Administrator" : user?.role ?? "";

    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    {initial}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">
                        {user?.name ?? "Memuat..."}
                    </p>
                    <p className="text-xs text-blue-500">{roleLabel}</p>
                </div>
            </div>

            <Button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
                title="Logout"
            >
                <BiLogOut size={25} className="text-slate-600" />
            </Button>
        </div>
    );
};

export default ProfileCard;