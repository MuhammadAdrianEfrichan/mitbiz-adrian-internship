import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContentLogin from "../../components/fragments/ContentLogin";
import LeftCopy from "../../components/fragments/LeftCopy";
import LoginCard from "../../components/fragments/LoginCard";
import TagLine from "../../components/fragments/TagLine";
import FormLogin from "../../components/fragments/FormLogin";
import { changePassword } from "../../services/auth.service";

const LupaPasswordPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const fields = [
        { label: "Password lama", name: "oldPassword", type: "password", placeholder: "Masukkan password lama", required: true },
        { label: "Password baru", name: "newPassword", type: "password", placeholder: "Masukkan password baru", required: true, minLength: 6 },
        { label: "Konfirmasi password baru", name: "confirmPassword", type: "password", placeholder: "Ulangi password baru", required: true, minLength: 6 },
    ];

    const handleChange = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
        setMessage({ type: "", text: "" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ type: "error", text: "Konfirmasi password baru tidak sama." });
            return;
        }
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await changePassword(form);
            setMessage({ type: "success", text: "Password berhasil diubah." });
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => navigate("/"), 1200);
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Gagal mengubah password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContentLogin>
            <LeftCopy title="Amankan akun bisnis Anda" />
            <LoginCard>
                <TagLine title="Ubah Password" subtitle="Masukkan password lama dan password baru Anda." />
                {message.text && <p className={`mb-3 text-sm ${message.type === "error" ? "text-red-500" : "text-emerald-600"}`}>{message.text}</p>}
                <FormLogin fields={fields} values={form} onFieldChange={handleChange} onSubmit={handleSubmit} submitLabel={loading ? "Memproses..." : "Ubah Password"} showFooterText={false} />
                <Link to="/" className="mt-4 block text-center text-sm font-medium text-blue-600 hover:underline">Kembali ke login</Link>
            </LoginCard>
        </ContentLogin>
    );
};

export default LupaPasswordPage;
