import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  // ⚠️ DEVELOPMENT MODE: Authentication temporarily disabled
  // To re-enable authentication, uncomment the code below and comment out the next line
  console.log('🔓 Authentication bypassed for development mode');
  return children;

  // Original authentication code (commented out):
  /*
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-3">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
  */
};

export default ProtectedRoute;
