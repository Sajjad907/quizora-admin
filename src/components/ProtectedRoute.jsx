import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center animate-pulse shadow-2xl shadow-primary/20">
                    <Loader2 className="text-white animate-spin" size={32} />
                </div>
                <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                    Establishing Secure Link
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
