import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/Login/auth.service";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await getMe();
            const authenticatedUser = data.data?.user ?? data.data ?? data.user ?? null;
            setUser(authenticatedUser);
            return authenticatedUser;
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


