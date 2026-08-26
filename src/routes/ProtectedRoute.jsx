import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getMe } from "../services/Login/auth.service";
import UseAuth from "../components/hooks/UseAuth";


const getHomeRoute = (user) => {
    if (!user) return "/";

    if (user.portalTarget === "SUPER_ADMIN" || user.role === "SUPER_ADMIN") {
        return "/dashboard-superadmin";
    }

    const isKasirOnly =
        user.portalTarget === "POS" ||
        (user.role === "STAFF" && !user.permissions?.some((p) => p !== "MENU_POS"));

    return isKasirOnly ? "/dasboard-kasir" : "/home-admin";
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = UseAuth();
    const currentRoute = useLocation().pathname;

    if (loading) {
        return <p>Memuat...</p>;
    }

    if (!user && currentRoute !== "/") {
        return <Navigate to="/" replace />;
    }

    if (user && currentRoute === "/") {
        return <Navigate to={getHomeRoute(user)} replace />;
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getHomeRoute(user)} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;