import FormLogin from '../../components/fragments/FormLogin'
import LeftCopy from '../../components/fragments/LeftCopy'
import LoginCard from '../../components/fragments/LoginCard'
import ContentLogin from '../../components/fragments/ContentLogin'
import TagLine from '../../components/fragments/TagLine'
import LupaPassword from '../../components/fragments/LupaPassword'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../../services/auth.service'

const Login = ()=>{
    const loginFields = [
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        placeholder: 'Masukkan email Anda',
        required: true,
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        placeholder: 'Masukkan password Anda',
        required: true,
    },
];

     const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.includes("@")) newErrors.email = "Email tidak valid";
        if (!form.password) newErrors.password = "Password wajib diisi";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const data = await login(form);
            console.log("Login berhasil:", data);

            if (data.token || data.data?.token) {
                localStorage.setItem("token", data.token ?? data.data.token);
            }
            navigate("/home-admin"); 
        } catch (err) {
            setServerError(err.message || "Tidak bisa terhubung ke server");
        } finally {
            setLoading(false);
        }
    };
    return(
        <ContentLogin>
            <LeftCopy />
            <LoginCard >
                <TagLine />
                {serverError && (
                    <p className="text-red-500 text-sm mb-3">{serverError}</p>
                )}

                <FormLogin
                    variant="login"
                    fields={loginFields}      
                    values={form}              
                    onSubmit={handleSubmit}
                    onFieldChange={handleChange}
                    submitLabel={loading ? "Memproses..." : "Masuk"}
                >
                    <LupaPassword />

                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </FormLogin>
            </LoginCard>
        </ContentLogin>

    );
}

export default Login