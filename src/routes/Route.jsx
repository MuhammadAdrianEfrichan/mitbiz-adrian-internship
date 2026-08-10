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
import RegisterBisnis from "../pages/Register/RegisterBisnis";
import ProtectedRoute from "./ProtectedRoute";


const routes =[
    {
        path: '/',
        element : <Login />
    },
    {
        path : '/register-admin',
        element : <RegisterAdmin />
    },
    {
        path: '/register-bisnis',
        element : <RegisterBisnis />,
    },
    {
        path: '/register-outlet',
        element : <RegisterOutlet />,
    },
    {
        path: '/register-done',
        element : <RegisterDone />,
    },

    // kasir
    {
        path: '/dasboard-kasir',
        element : <ProtectedRoute allowedRoles={["STAFF"]}>
                    <Home />
                </ProtectedRoute>,
        children: [
        { index: true, element: <Home /> },
    ],
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
        element : <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <HomeAdmin />
                </ProtectedRoute>,
        children: [
        { index: true, element: <HomeAdmin /> },
        { path: "cabang-admin", element: <Cabang /> },
        { path: "kasir-admin", element: <Kasir /> },  
    ],
    },

    {
        path : '/laporan-admin',
        element : <ProtectedRoute>
                    <Laporan />
                    </ProtectedRoute>
    },
    {
        path : '/cabang-admin',
        element : <ProtectedRoute>
                    <Cabang />
                    </ProtectedRoute>
    },
    {
        path : '/kasir-admin',
        element :<ProtectedRoute>
                    <Kasir />
                </ProtectedRoute> 
    },
    {
        path : '/produk-admin',
        element : <ProtectedRoute>
                    <Produk />
                    </ProtectedRoute>
    },
    {
        path : '/kategori-admin',
        element :<ProtectedRoute> 
                <Kategori />
                </ProtectedRoute>
    },
    {
        path : '/metode-pembayaran-admin',
        element : <ProtectedRoute> 
                    <Pembayaran />
                </ProtectedRoute>
    },
    {
        path : '/stok-admin',
        element : <ProtectedRoute> 
                    <AdminStok />
                </ProtectedRoute>
    },
    {
        path : '/penyesuaian-stok-admin',
        element : <ProtectedRoute> 
            <PenyesuaianStok />
            </ProtectedRoute>
    },
    {
        path : '/pengaturan-admin',
        element :<ProtectedRoute> 
                    <Pengaturan />
                </ProtectedRoute> 
    },
    {
        path : '/riwayat-transaksi-admin',
        element :<ProtectedRoute>
                    <Riwayat />
                </ProtectedRoute>         
    },
    {
        path : '/shift-kasir-admin',
        element :<ProtectedRoute>
                <ShiftKasir />
                </ProtectedRoute> 
    },
]

export default routes;