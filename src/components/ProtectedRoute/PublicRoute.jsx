import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const { id, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  
  if (id) {
    return <Navigate to="/home" replace />;
  }
  
  return <Outlet />;
}

export default PublicRoute;