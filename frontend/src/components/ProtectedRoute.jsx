import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
