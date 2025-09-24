import { 
  Check, 
  Users, 
  Globe, 
  MapPin, 
  Route, 
  Car, 
  UserCheck, 
  Calendar, 
  FileText, 
  LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Check },
    { path: "/operator-management", label: "Operator Management", icon: Users },
    { path: "/country-segment-management", label: "Country & Segment Management", icon: Globe },
    { path: "/poi-management", label: "POI Management", icon: MapPin },
    { path: "/route-management", label: "Route Management", icon: Route },
    { path: "/service-provider-management", label: "Service Provider Management", icon: Car },
    { path: "/agent-management", label: "Agent Management", icon: UserCheck },
    { path: "/booking-management", label: "Booking Management", icon: Calendar },
    { path: "/assignment-management", label: "Assignment Management", icon: FileText },
  ];

  return (
    <div className="sidebar">
      {/* Header with gradient background */}
      <div className="sidebar-header">
        <h1>My DMC</h1>
        <p>Booking System</p>
      </div>
      
      {/* Navigation Items */}
      <div className="sidebar-nav">
        <ul>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive ? "active" : ""}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Logout at bottom */}
      <div className="sidebar-logout">
        <div>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
