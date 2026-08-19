import { RouterProvider } from "react-router-dom"
import router from './routes'
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./components/ui/NotificationCenter"


function App() {
    return (
    <NotificationProvider>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </NotificationProvider>
    
    )
}

export default App
