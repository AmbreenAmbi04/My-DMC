import { Bell, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

const NavigationBar = ({ onToggleSidebar }) => {
  return (
    <div className="bg-white shadow-sm p-4">
      {/* Single row with mobile menu, welcome message, and user profile */}
      <div className="d-flex justify-content-between align-items-center">
        {/* Left side - Mobile menu button and Welcome message */}
        <div className="d-flex align-items-center">
          {/* Mobile menu button */}
          <button 
            className="btn btn-outline-secondary d-md-none me-3" 
            onClick={onToggleSidebar}
          >
            <Menu size={20} />
          </button>
          
          {/* Welcome message */}
          <h1 className="h4 fw-semibold text-dark mb-0">Welcome Back Admin!</h1>
        </div>
        
        {/* Right side - User profile section */}
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary rounded-circle p-2 me-3">
            <Bell size={20} />
          </button>
          <div className="d-flex align-items-center">
            <div className="bg-purple rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{width: '40px', height: '40px', backgroundColor: '#7c3aed'}}>
              AU
            </div>
            <div className="d-flex align-items-center">
              <div className="me-2">
                <p className="mb-0 small fw-medium text-dark">Admin User</p>
                <p className="mb-0 small text-muted">Admin User</p>
              </div>
              <ChevronDown size={16} className="text-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  export default NavigationBar;
  