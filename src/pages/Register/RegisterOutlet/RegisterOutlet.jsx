import ContentLogin from '../../../components/fragments/ContentLogin';
import LeftCopy from '../../../components/fragments/LeftCopy';
import LoginCard from '../../../components/fragments/LoginCard';
import TagLine from '../../../components/fragments/TagLine';
import InputLogin from '../../../components/fragments/InputLogin';
import ButtonLogin from '../../../components/fragments/ButtonLogin';
import { useState } from 'react';

const steps = ['Akun', 'Bisnis', 'Outlet'];

const RegisterOutlet = ({onNext, loading}) => {
    const [form, setForm] = useState({
        outletName: '',
        outletAddress: '',
        outletPhone: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.outletName.trim()) newErrors.outletName = 'Nama outlet wajib diisi';
        if (!form.outletAddress.trim()) newErrors.outletAddress = 'Alamat outlet wajib diisi';
        if (!form.outletPhone.trim() || !form.outletPhone.includes('+62')) newErrors.outletPhone = 'Nomor telepon outlet wajib diisi dengan format +62';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        onNext(form);
    };

    return (
        <ContentLogin>
            <LeftCopy
                title="Mulai Kelola Bisnis Lebih Cerdas Hari Ini"
                description="Dafarkan bisnis Anda dan nikmati sistem kasir multi-cabang yang terintegrasi penuh dalam hitungan menit."
                badges={['Transaksi Real-time', 'Manajemen Stok Otomatis', 'Laporan Per Cabang']}
            />

            <LoginCard className="w-full max-w-155">
                <div className="mx-auto flex w-full max-w-105 items-center justify-between gap-2">
                    {steps.map((step, index) => {
                        const isDone = index < 2;
                        const isCurrent = index === 2;

                        return (
                            <div key={step} className="flex flex-1 flex-col items-center gap-2">
                                <div className="flex w-full items-center">
                                    {index > 0 && (
                                        <div
                                            className={`h-0.5 flex-1 ${
                                                isDone ? 'bg-[#0F74D7]' : 'bg-slate-300'
                                            }`}
                                        />
                                    )}

                                    <div
                                        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                                            isDone
                                                ? 'border-[#2FBF71] bg-[#2FBF71] text-white'
                                                : isCurrent
                                                ? 'border-[#0F74D7] bg-[#0F74D7] text-white'
                                                : 'border-slate-300 bg-white text-slate-500'
                                        }`}
                                    >
                                        {isDone ? '✓' : index + 1}
                                    </div>

                                    {index < steps.length - 1 && (
                                        <div
                                            className={`h-0.5 flex-1 ${
                                                isDone ? 'bg-[#0F74D7]' : 'bg-slate-300'
                                            }`}
                                        />
                                    )}
                                </div>

                                <span className={`text-xs ${isCurrent ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <TagLine
                    title="Setup Outlet Pertama"
                    subtitle="Outlet adalah lokasi kasir Anda. Anda bisa menambah lebih banyak nanti."
                />

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-slate-700">
                            Nama Outlet <span className="text-red-500">*</span>
                        </label>
                        <InputLogin
                            name="outletName"
                            placeholder="Contoh: Cabang Utama"
                            value={form.outletName}
                            onChange={handleChange}
                        />
                        {errors.outletName && <p className="text-sm text-red-500">{errors.outletName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium text-slate-700">
                            Alamat Outlet <span className="text-red-500">*</span>
                        </label>
                        <InputLogin
                            name="outletAddress"
                            placeholder="Jl. Abu Hanifah No.8, Padang Panjang"
                            value={form.outletAddress}
                            onChange={handleChange}
                        />
                        {errors.outletAddress && <p className="text-sm text-red-500">{errors.outletAddress}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium text-slate-700">
                            Nomor Telepon Outlet <span className="text-red-500">*</span>
                        </label>
                        <InputLogin
                            name="outletPhone"
                            placeholder="+62 875-0000-0000"
                            value={form.outletPhone}
                            onChange={handleChange}
                        />
                        {errors.outletPhone && <p className="text-sm text-red-500">{errors.outletPhone}</p>}
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="mr-2">&lt;</span> Kembali
                        </button>

                        <ButtonLogin className="max-w-50" type='submit' disabled={loading}>
                            {loading ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                                    Mengirim...
                                </span>
                            ) : 'Buat Akun'}
                        </ButtonLogin>
                    </div>
                </form>
            </LoginCard>
        </ContentLogin>
    );
};

export default RegisterOutlet;