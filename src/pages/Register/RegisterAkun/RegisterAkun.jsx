import { useMemo, useState } from 'react';
import ContentLogin from '../../../components/fragments/ContentLogin';
import FormLogin from '../../../components/fragments/FormLogin';
import LeftCopy from '../../../components/fragments/LeftCopy';
import LoginCard from '../../../components/fragments/LoginCard';
import TagLine from '../../../components/fragments/TagLine';

const RegisterAkun = ({onNext,loading} ) => {
    const [form, setForm] = useState({
        name : "",
        email : "",
        phone : "",
        password : "",
        confirmPassword : "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) =>{
        const {name, value } = e.target;
        setForm((prev)=> ({...prev, [name] : value}));
    };

        const validate = () => {
            const newErrors = {};
            if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
            if (!form.email.includes("@")) newErrors.email = "Email tidak valid";
            if (!form.phone.includes("+62"||"08")) newErrors.phone = "Nomor Phone tidak valid";
            if (form.password.length < 8) newErrors.password = "Password minimal 8 karakter";
            if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Password tidak sama";
            return newErrors;
        };
        const handleSubmit = (e) =>{
            e.preventDefault();
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0){
                setErrors(validationErrors);
                return;
            }
            setErrors({});
            onNext(form);
        }


    const registerFields = useMemo(
        () => [
            {
                label: 'Nama Lengkap',
                name: 'name',
                type: 'text',
                placeholder: 'Contoh: Budi Santoso',
                required: true,

            },
            {
                label: 'Email',
                name: 'email',
                type: 'email',
                placeholder: 'email@bisnis.com',
                required: true,
            },
            {
                label: 'Nomor WhatsApp',
                name: 'phone',
                type: 'tel',
                placeholder: '+62 812-3456-7890',
                required: true,

            },
            {
                label: 'Password',
                name: 'password',
                type: 'password',
                placeholder: 'Min. 8 karakter',
                minLength: 8,
                required: true,
            },
            {
                label: 'Konfirmasi Password',
                name: 'confirmPassword',
                type: 'password',
                placeholder: 'Ulangi password',
                minLength: 8,
                required: true,
            },
        ],
        [],
    );


    return (
        <ContentLogin>
            <LeftCopy
                title="Mulai Kelola Bisnis Lebih Cerdas Hari Ini"
                description="Dafarkan bisnis Anda dan nikmati sistem kasir multi-cabang yang terintegrasi penuh dalam hitungan menit."
                badges={['Transaksi Real-time', 'Manajemen Stok Otomatis', 'Laporan Per Cabang']}
            />

            <LoginCard className="w-full max-w-135">
                <div className="mx-auto flex w-full max-w-75 items-center justify-between gap-4 rounded-xl">
                    {['Akun', 'Bisnis', 'Outlet'].map((step, index) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                                    index === 0
                                        ? 'border-[#0F74D7] bg-[#0F74D7] text-white'
                                        : 'border-slate-300 bg-white text-slate-500'
                                }`}
                            >
                                {index + 1}
                            </div>
                            <span className={`text-xs ${index === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>

                <TagLine
                    title="Buat Akun Anda"
                    subtitle="Masukkan detail akun untuk mengakses Mitbiz POS"
                />

                <FormLogin
                    variant="register"
                    fields={registerFields}
                    values={form}
                    onFieldChange={handleChange}
                    onSubmit = {handleSubmit}
                    submitLabel="Lanjut ke Info Bisnis"
                    showFooterText={false}
                >
                    <label className="flex items-start gap-3 pt-1 text-sm text-slate-600">
                        <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F74D7] focus:ring-[#0F74D7]" />
                        <span>
                            Saya menyetujui <span className="font-semibold text-[#0F74D7]">Syarat & Ketentuan</span> serta
                            Kebijakan Privasi Mitbiz
                        </span>
                    </label>
                </FormLogin>
            </LoginCard>
        </ContentLogin>
    );
};

export default RegisterAkun;