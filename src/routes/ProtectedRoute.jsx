import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getMe } from "../services/auth.service";
import UseAuth from "../components/hooks/UseAuth";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = UseAuth();
    const currentRoute = useLocation().pathname;


       if (loading) {
        return <p>Memuat...</p>;
    }

    if (!user && currentRoute !== '/') {
        return <Navigate to="/" replace />;
    }

    if (user && currentRoute === '/') {
        return <Navigate to="/home-admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;