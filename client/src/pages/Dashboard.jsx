import SideBar from "../components/SideBar";
import NavigationBar from "../components/NavigationBar";
import DashboardCards from "../components/DashboardCards";
import BookingsOverview from "../components/BookingsOverview";
import "../App.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="main-content">
        <NavigationBar />
        <div className="content-area">
          <DashboardCards />
          <BookingsOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
