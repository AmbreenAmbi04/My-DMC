import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import BookingsOverview from "../components/BookingsOverview";
import "../App.css";

const Dashboard = () => {
  return (
    <Layout>
      <DashboardCards />
      <BookingsOverview />
    </Layout>
  );
};

export default Dashboard;
