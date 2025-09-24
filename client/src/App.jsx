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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/operator-management" element={<OperatorManagement />} />
        <Route path="/country-segment-management" element={<CountrySegmentManagement />} />
        <Route path="/poi-management" element={<POIManagement />} />
        <Route path="/route-management" element={<RouteManagement />} />
        <Route path="/service-provider-management" element={<ServiceProviderManagement />} />
        <Route path="/agent-management" element={<AgentManagement />} />
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/assignment-management" element={<AssignmentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
