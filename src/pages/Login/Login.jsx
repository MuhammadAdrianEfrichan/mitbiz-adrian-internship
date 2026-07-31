import logo from '../../assets/image.png'
import btm from '../../assets/btm.png'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

const Login = ()=>{
    return(
        <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0A1F4D] via-[#0A5CB3 to-[#0A5CB3]">
            {/* decorative giant logo mark, bottom-left */}
            <div className="pointer-events-none absolute -bottom-20 -left-38 h-80 w-120 overflow-hidden opacity-90">
                <img
                    src={btm}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full -rotate-9 object-cover object-left "
                    style={{ objectPosition: "0% 50%" }}
                />
            </div>
            {/* main content */}
            <div className="relative mx-auto min-h-[calc(100vh-88px)] max-w-9xl px-6 sm:px-12">
            {/* top bar */}
            <div className="absolute z-10 mt-10 w-[50%]">
                <img src={logo} alt="Mitbiz" className="h-15 w-auto" />
            </div>
                <div className="flex  flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:justify-between ">
                {/* left copy */}
                <div className="w-160 text-white">
                    <h1 className="text-5xl font-semibold leading-tight sm:text-5xl">
                        Sistem Kasir Multi Cabang
                        <br />
                        yang Lebih Terkontrol
                    </h1>
                    <div className="mt-6 flex flex-wrap gap-3">
                            <span
                                className="rounded-full border border-blue-500 px-4 py-1.5 text-md text-white/90"
                            >Transaksi Real-time
                            </span>
                            <span
                                className="rounded-full border border-blue-500 px-4 py-1.5 text-md text-white/90"
                            >Manajemen Stok Otomatis
                            </span>
                            <span
                                className="rounded-full border border-blue-500 px-4 py-1.5 text-md text-white/90"
                            >Laporan Per Cabang
                            </span>
                    </div>
                </div>
                {/* login card */}
                <div className="w-170 h-auto rounded-2xl bg-white px-20 py-36 shadow-xl my-20 mr-50">
                    <div className="flex flex-col justify-center gap-10" >
                    <div className=""> <h2 className="text-2xl font-semibold text-gray-900">
                        Masuk ke Mitbiz POS
                    </h2>
                    <p className="mt-2 text-xl text-gray-500">
                        Kelola transaksi, stok, dan laporan dalam satu sistem
                        terintegrasi.
                    </p></div>

                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-xl font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Input your email"
                                classname="w-full rounded-2xl border border-gray-300 px-6 py-4 text-sm text-gray-900 placeholder:text-gray-400 placeholder:text-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
 
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-2xl font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Input your store password"
                                classname="w-full rounded-2xl border border-gray-300 px-6 py-4 text-sm text-gray-900 placeholder:text-gray-400 placeholder:text-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
 
                        <div className="text-right">
                            <a
                                href="#"
                                className="text-xl text-blue-600 hover:underline "
                            >
                                Lupa password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            name="next"
                            classname="w-full rounded-lg bg-blue-600 py-2.5 text-xl font-medium text-white transition hover:bg-blue-700 cursor-pointer">
                            Next
                        </Button>

                        <p className="text-center text-md text-gray-500">
                            Butuh bantuan?{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                Hubungi admin bisnis Anda.
                            </a>
                        </p>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Login