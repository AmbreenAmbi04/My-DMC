import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OperatorManagement from "./pages/OperatorManagement";
import CountrySegmentManagement from "./pages/CountrySegmentManagement";
import POIManagement from "./pages/POIManagement";
import RouteManagement from "./pages/RouteManagement";
import ServiceProviderManagement from "./pages/ServiceProviderManagement";
import AgentManagement from "./pages/AgentManagement";
import BookingManagement from "./pages/BookingManagement";
import AssignmentManagement from "./pages/AssignmentManagement";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {

  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/operator-management" 
            element={
              <ProtectedRoute>
                <OperatorManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/country-segment-management" 
            element={
              <ProtectedRoute>
                <CountrySegmentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/poi-management" 
            element={
              <ProtectedRoute>
                <POIManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/route-management" 
            element={
              <ProtectedRoute>
                <RouteManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service-provider-management" 
            element={
              <ProtectedRoute>
                <ServiceProviderManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent-management" 
            element={
              <ProtectedRoute>
                <AgentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-management" 
            element={
              <ProtectedRoute>
                <BookingManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assignment-management" 
            element={
              <ProtectedRoute>
                <AssignmentManagement />
              </ProtectedRoute>
            } 
          />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
