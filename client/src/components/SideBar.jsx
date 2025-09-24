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

const SideBar = ({ isOpen, onClose }) => {
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
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
          style={{zIndex: 999}}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar d-flex flex-column vh-100 position-fixed start-0 top-0 bg-white shadow-lg ${isOpen ? 'show' : ''}`} style={{width: '280px', zIndex: 1000}}>
        {/* Header with gradient background */}
        <div className="sidebar-header text-white p-4" style={{background: 'linear-gradient(to right, #9333ea, #7c3aed)'}}>
          <h1 className="h4 fw-bold mb-1">My DMC</h1>
          <p className="mb-0 small text-light">Booking System</p>
        </div>
        
        {/* Navigation Items */}
        <div className="sidebar-nav flex-grow-1 p-3">
          <ul className="list-unstyled mb-0">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    className={`d-flex align-items-center text-decoration-none p-3 rounded-3 text-dark ${isActive ? 'bg-light-purple text-purple fw-medium' : 'hover-bg-light'}`}
                    style={isActive ? {backgroundColor: '#f3e8ff', color: '#7c3aed'} : {}}
                    onClick={() => {
                      // Close sidebar on mobile when link is clicked
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                  >
                    <IconComponent size={20} className="me-3" />
                    <span className={isActive ? 'fw-medium' : ''}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Logout at bottom */}
        <div className="p-3">
          <div className="d-flex align-items-center text-danger p-3 rounded-3 hover-bg-light cursor-pointer" onClick={onClose}>
            <LogOut size={20} className="me-3" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
