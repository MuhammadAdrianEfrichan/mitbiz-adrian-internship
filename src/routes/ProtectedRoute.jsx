import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getMe } from "../services/auth.service";
import UseAuth from "../components/hooks/UseAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = UseAuth();
    const currentRoute = useLocation().pathname;


       if (loading) {
        return <p>Memuat...</p>;
    }

    if (!user && currentRoute !== '/') {
        return <Navigate to="/" replace />;
    }

    if (user && currentRoute === '/') {
        // Gunakan portalTarget dari backend (dikirim via getMe)
        // POS = kasir, selain itu = admin panel
        const isKasirOnly = user.portalTarget === 'POS' || 
            (user.role === "STAFF" && !user.permissions?.some(p => p !== "MENU_POS"));
        const home = isKasirOnly ? "/dasboard-kasir" : "/home-admin";
        return <Navigate to={home} replace />;
    }
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        const isKasirOnly = user.portalTarget === 'POS' || 
            (user.role === "STAFF" && !user.permissions?.some(p => p !== "MENU_POS"));
        const home = isKasirOnly ? "/dasboard-kasir" : "/home-admin";
        return <Navigate to={home} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;