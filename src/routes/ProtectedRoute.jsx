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
        const home = user.role === "STAFF" ? "/dasboard-kasir" : "/home-admin";
        return <Navigate to={home} replace />;
    }
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        const home = user.role === "STAFF" ? "/dasboard-kasir" : "/home-admin";
        return <Navigate to={home} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;