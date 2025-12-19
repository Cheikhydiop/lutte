import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

export function RequireAdmin() {
    const { user, isAuthenticated, isLoading } = useAuth();

    // TEMPORAIRE: Désactivation de l'auth pour développement
    /*
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
        return <Navigate to="/auth" replace />;
    }
    */

    return <Outlet />;
}
