import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
const UseAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider");
    return context;
};

export default UseAuth