import Login from "../pages/Login";
import RegisterAkun from '../pages/Register/RegisterAkun'
import RegisterOutlet from '../pages/Register/RegisterOutlet'
import RegisterDone from '../pages/Register/RegisterDone'
import Home from "../pages/User/Home/Home";
import Stok from "../pages/User/Stok";
import Transaksi from "../pages/User/Transaksi";
import RiwayatTransaksi from "../pages/User/RiyawatTransaksi";
import HomeAdmin from "../pages/Admin/Home/Home";
import RegisterAdmin from "../pages/Admin/RegisterAdmin";
import Laporan from "../pages/Admin/Laporan/Laporan";
import Cabang from "../pages/Admin/Cabang/Cabang";
import Kasir from "../pages/Admin/Kasir/Kasir";
import Produk from "../pages/Admin/Produk/Produk";
import Kategori from "../pages/Admin/Kategori/Kategori";
import Pembayaran from "../pages/Admin/Pembayaran";
import AdminStok from "../pages/Admin/AdminStok/AdminStok";
import PenyesuaianStok from "../pages/Admin/PenyesuaianStok/PenyesuaianStok";
import Pengaturan from "../pages/Admin/Pengaturan/Pengaturan";
import Riwayat from "../pages/Admin/Riwayat/Riwayat";
import ShiftKasir from "../pages/Admin/ShiftKasir/ShiftKasir";


const routes =[
    {
        path: '/',
        element : <Login />
    },
    {
        path: '/register-akun',
        element : <RegisterAkun />,
    },
    {
        path: '/register-outlet',
        element : <RegisterOutlet />,
    },
    {
        path: '/register-done',
        element : <RegisterDone />,
    },
    {
        path: '/dasboard-kasir',
        element : <Home />,
    },
    {
        path: '/stok-kasir',
        element : <Stok />,
    },
    {
        path: '/transaksi-kasir',
        element : <Transaksi />,
    },
    {
        path: '/riwayat-transaksi-kasir',
        element : <RiwayatTransaksi />,
    },
    // Admin
    {
        path: '/home-admin',
        element : <HomeAdmin />,
    },
    {
        path : '/register-admin',
        element : <RegisterAdmin />
    },
    {
        path : '/laporan-admin',
        element : <Laporan />
    },
    {
        path : '/cabang-admin',
        element : <Cabang />
    },
    {
        path : '/kasir-admin',
        element : <Kasir />
    },
    {
        path : '/produk-admin',
        element : <Produk />
    },
    {
        path : '/kategori-admin',
        element : <Kategori />
    },
    {
        path : '/metode-pembayaran-admin',
        element : <Pembayaran />
    },
    {
        path : '/stok-admin',
        element : <AdminStok />
    },
    {
        path : '/penyesuaian-stok-admin',
        element : <PenyesuaianStok />
    },
    {
        path : '/pengaturan-admin',
        element : <Pengaturan />
    },
    {
        path : '/riwayat-transaksi-admin',
        element : <Riwayat />
    },
    {
        path : '/shift-kasir-admin',
        element : <ShiftKasir />
    },
]

export default routes;