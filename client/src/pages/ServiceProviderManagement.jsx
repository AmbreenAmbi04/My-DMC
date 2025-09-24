import SideBar from "../components/SideBar";
import NavigationBar from "../components/NavigationBar";

const ServiceProviderManagement = () => {
  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="main-content">
        <NavigationBar />
        <div className="content-area">
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem'}}>Service Provider Management</h1>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
            <p style={{color: '#6b7280'}}>Service provider management content will go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderManagement;
