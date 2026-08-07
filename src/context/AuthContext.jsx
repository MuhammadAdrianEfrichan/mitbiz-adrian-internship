import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.service";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await getMe();
            setUser(data.data ?? null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};


