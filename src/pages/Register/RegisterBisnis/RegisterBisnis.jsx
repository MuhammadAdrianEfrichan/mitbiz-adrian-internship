import ContentLogin from '../../../components/fragments/ContentLogin';
import LeftCopy from '../../../components/fragments/LeftCopy';
import LoginCard from '../../../components/fragments/LoginCard';
import TagLine from '../../../components/fragments/TagLine';
import InputLogin from '../../../components/fragments/InputLogin';
import ButtonLogin from '../../../components/fragments/ButtonLogin';

const steps = ['Akun', 'Bisnis', 'Outlet'];


const RegisterBisnis = () => {
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
                        const isDone = index < 1;
                        const isCurrent = index === 1;

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
                    title="Informasi Bisnis"
                    subtitle="Isi detail bisnis Anda untuk personalisasi pengalaman POS."
                />

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-slate-700">
                            Nama Bisnis <span className="text-red-500">*</span>
                        </label>
                        <InputLogin
                            name="businessName"
                            placeholder="Contoh: Budi Santoso"
                            defaultValue=""
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium text-slate-700">
                            Kategori Bisnis <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="">Pilih kategori bisnis</option>
                            <option value="toko">Toko</option>
                            <option value="restoran">Restoran</option>
                            <option value="kafe">Kafe</option>
                            <option value="laundry">Laundry</option>
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-base font-medium text-slate-700">
                                Kota <span className="text-red-500">*</span>
                            </label>
                            <InputLogin name="city" placeholder="Padang Panjang" defaultValue="" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-base font-medium text-slate-700">
                                Provinsi <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-600 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100">
                                <option value="">Sumatera Barat</option>
                                <option value="jawa-barat">Jawa Barat</option>
                                <option value="jakarta">DKI Jakarta</option>
                                <option value="sumut">Sumatera Utara</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <span className="mr-2">&lt;</span> Kembali
                        </button>

                        <ButtonLogin className="max-w-55">Lanjut ke Outlet</ButtonLogin>
                    </div>
                </form>
            </LoginCard>
        </ContentLogin>
    );
};

export default RegisterBisnis;