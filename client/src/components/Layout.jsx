import { useState } from "react";
import SideBar from "./SideBar";
import NavigationBar from "./NavigationBar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="container-fluid p-0">
      <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-content" style={{marginLeft: '280px'}}>
        <NavigationBar onToggleSidebar={toggleSidebar} />
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
