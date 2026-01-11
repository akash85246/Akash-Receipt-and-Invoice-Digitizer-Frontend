import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const { id, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }
  console.log("ProtectedRoute - User ID:", id);
  
  if (!id) {

    return <Navigate to="/welcome" replace />;
  }

  
  return <Outlet />;
}

export default ProtectedRoute;