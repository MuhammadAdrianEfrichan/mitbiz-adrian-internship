import { Navigate, useLocation } from "react-router-dom";
import UseAuth from "../components/hooks/UseAuth";
import { getUserPermissions, getUserRole } from "../utils/authorization";

const getHomePath = (user) => getUserRole(user) === "STAFF" ? "/dasboard-kasir" : "/home-admin";

const ProtectedRoute = ({ children, allowedRoles, requiredPermission, adminOnly = false, cashierOnly = false }) => {
    const { user, loading } = UseAuth();
    const currentRoute = useLocation().pathname;


       if (loading) {
        return <p>Memuat...</p>;
    }

    if (!user && currentRoute !== '/') {
        return <Navigate to="/" replace />;
    }

    if (user && currentRoute === '/') {
        return <Navigate to={getHomePath(user)} replace />;
    }
    const role = getUserRole(user);
    if (user && cashierOnly && role !== "STAFF") {
        return <Navigate to="/home-admin" replace />;
    }
    if (user && adminOnly && role === "STAFF") {
        return <Navigate to="/dasboard-kasir" replace />;
    }
    if (user && allowedRoles && !allowedRoles.map((item) => item.toUpperCase()).includes(role)) {
        return <Navigate to={getHomePath(user)} replace />;
    }
    if (user && requiredPermission && role !== "ADMIN" && !getUserPermissions(user).includes(requiredPermission.toUpperCase())) {
        return <Navigate to={getHomePath(user)} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;