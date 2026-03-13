import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../shared/components/ui/LoadingScreen";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen message="Establishing Secure Link..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
