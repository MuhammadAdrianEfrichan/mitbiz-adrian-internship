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

            {/* top bar */}
            <div className="relative z-10 flex items-center justify-between px-10 py-3 sm:px-12">
                <img src={logo} alt="Mitbiz" className="h-7 w-auto sm:h-8" />
            </div>

            {/* main content */}
            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-9xl flex-col items-center justify-center gap-10 px-6 sm:px-12 lg:flex-row lg:items-center lg:justify-around">
                {/* left copy */}
                <div className="w-150 text-white">
                    <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                        Sistem Kasir Multi Cabang
                        <br />
                        yang Lebih Terkontrol
                    </h1>
                    <div className="mt-6 flex flex-wrap gap-3">
                        
                            <span
                                className="rounded-full border border-blue-500 px-4 py-1.5 text-sm text-white/90"
                            >Transaksi Real-time
                            </span>
                            <span
                                className="rounded-full border border-blue-500 px-4 py-1.5 text-sm text-white/90"
                            >Manajemen Stok Otomatis
                            </span>
                            <span
                                className="rounded-full border border-blue-500 px-4 py-1.5 text-sm text-white/90"
                            >Laporan Per Cabang
                            </span>
                    </div>
                </div>
                {/* login card */}
                <div className="w-full h-auto max-w-md rounded-2xl bg-white px-10 py-20 shadow-xl ">
                    <div className="flex flex-col justify-center" >
                    <h2 className="text-xl font-semibold text-gray-900">
                        Masuk ke Mitbiz POS
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Kelola transaksi, stok, dan laporan dalam satu sistem
                        terintegrasi.
                    </p>
 
                    <form className="mt-6 space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Input your email"
                                classname="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
 
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Input your store password"
                                classname="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
 
                        <div className="text-right">
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Lupa password?
                            </a>
                        </div>
 
                        <Button
                            type="submit"
                            name="next"
                            classname="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Next
                        </Button>
 
                        <p className="text-center text-sm text-gray-500">
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
    );
}

export default Login