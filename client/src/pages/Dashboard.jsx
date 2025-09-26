import Layout from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import BookingsOverview from "../components/BookingsOverview";
import "../App.css";
import axios from "axios";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // ✅ Set both message and (if present) data
        setMessage(response.data.message || "");
        setData(response.data.data || []); 
      })
      .catch(() => {
        setMessage("Failed to fetch data");
      });
  }, []);
  
  return (
    <Layout>
      <DashboardCards />
      <BookingsOverview />
      <ul>
        {data.map((item, idx) => (
          <li key={idx}>{JSON.stringify(item)}</li>
        ))}
      </ul>
      <p>{message}</p>
    </Layout>
  );
};

export default Dashboard;
