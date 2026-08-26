import FormLogin from '../../components/fragments/FormLogin'
import LeftCopy from '../../components/fragments/LeftCopy'
import LoginCard from '../../components/fragments/LoginCard'
import ContentLogin from '../../components/fragments/ContentLogin'
import TagLine from '../../components/fragments/TagLine'
import LupaPassword from '../../components/fragments/LupaPassword'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../../services/Login/auth.service'
import UseAuth from '../../components/hooks/UseAuth'

const Login = ()=>{
    const loginFields = [
    {
        label: 'Email / Username',
        name: 'identifier',
        type: 'text',
        placeholder: 'Masukkan email atau username',
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
     const { refetchUser } = UseAuth(); 

    const [form, setForm] = useState({
        identifier: "",
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
        if (!form.identifier) newErrors.identifier = "Email tidak valid";
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
            await refetchUser();
            const portalTarget = data.data?.portalTarget ?? data.portalTarget;
            if (portalTarget === "POS") {
                navigate("/dasboard-kasir");
            } else if(portalTarget === "SUPER_ADMIN"){
                navigate("/dashboard-superadmin");
            }
            else {
                navigate("/home-admin");
            }
        } catch (err) {
            setServerError(err.message || "Tidak bisa terhubung ke server");
        } finally {
            setLoading(false);
        }
    };
    return(
        <ContentLogin>
            <LeftCopy title='Sistem Kasir Multi Cabang Lebih Terkontrol' />
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

                    <Link to='/register-admin' className='text-xl text-blue-600 flex justify-end'>Register</Link>

                    {errors.identifier && <p className="text-red-500 text-xs">{errors.email}</p>}
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </FormLogin>
            </LoginCard>
        </ContentLogin>

    );
}

export default Login