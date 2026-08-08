import { useLocation, useNavigate } from 'react-router-dom';
import ContentLogin from '../../../components/fragments/ContentLogin';
import LeftCopy from '../../../components/fragments/LeftCopy';
import LoginCard from '../../../components/fragments/LoginCard';
import ButtonLogin from '../../../components/fragments/ButtonLogin';

const steps = ['Akun', 'Bisnis', 'Outlet'];

const RegisterDone = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const hasError = state?.status === 'error' || Boolean(state?.error);

    const title = hasError ? 'Pendaftaran Gagal' : 'Akun Berhasil Dibuat!';
    const description = hasError
        ? state?.error || 'Terjadi kesalahan saat membuat akun. Silakan coba lagi atau hubungi admin.'
        : 'Selamat datang di Mitbiz POS. Bisnis Anda sudah siap untuk mulai dengan cekmail untuk verifikasi akun.';
    const buttonText = 'Kembali ke Login';
    const iconText = hasError ? '!' : '✓';
    const iconClasses = hasError ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#DFF7E8] text-[#2FBF71]';
    const titleClasses = hasError ? 'text-3xl font-semibold text-[#DC2626]' : 'text-3xl font-semibold text-slate-800';

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
                        const isDone = index < 3;

                        return (
                            <div key={step} className="flex flex-1 flex-col items-center gap-2">
                                <div className="flex w-full items-center">
                                    {index > 0 && (
                                        <div className="h-0.5 flex-1 bg-[#0F74D7]" />
                                    )}

                                    <div
                                        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                                            isDone
                                                ? 'border-[#2FBF71] bg-[#2FBF71] text-white'
                                                : 'border-slate-300 bg-white text-slate-500'
                                        }`}
                                    >
                                        {isDone ? '✓' : index + 1}
                                    </div>

                                    {index < steps.length - 1 && (
                                        <div className="h-0.5 flex-1 bg-[#0F74D7]" />
                                    )}
                                </div>

                                <span className="text-xs text-slate-500">{step}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="mx-auto flex w-full max-w-105 flex-col items-center justify-center gap-5 py-6 text-center">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner ${iconClasses}`}>
                        {iconText}
                    </div>

                    <h3 className={titleClasses}>{title}</h3>

                    <p className="max-w-[320px] text-base leading-relaxed text-slate-500">
                        {description}
                    </p>

                    <div className="w-full pt-2">
                        <ButtonLogin
                            type="button"
                            className="max-w-105"
                            onClick={() => navigate('/')}
                        >
                            {buttonText}
                        </ButtonLogin>
                    </div>
                </div>
            </LoginCard>
        </ContentLogin>
    );
};

export default RegisterDone;