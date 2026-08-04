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
    }
]

export default routes;