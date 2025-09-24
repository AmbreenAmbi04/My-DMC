import { Bell, ChevronDown } from "lucide-react";

const NavigationBar = () => {
  return (
    <div className="navbar">
      {/* Top row with user profile */}
      <div className="navbar-top">
        <button className="bell-button">
          <Bell size={20} />
        </button>
        <div className="navbar-user">
          <div className="navbar-avatar">AU</div>
          <div className="navbar-user-info">
            <div>
              <p>Admin User</p>
              <p>Admin User</p>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      
      {/* Welcome message */}
      <div>
        <h1 className="navbar-welcome">Welcome Back Admin!</h1>
      </div>
    </div>
  );
};
  
  export default NavigationBar;
  