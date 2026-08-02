import Login from "../pages/Login";
import RegisterAkun from '../pages/Register/RegisterAkun'
import RegisterOutlet from '../pages/Register/RegisterOutlet'
import RegisterDone from '../pages/Register/RegisterDone'
import Home from "../pages/User/Home/Home";


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
    }
]

export default routes;