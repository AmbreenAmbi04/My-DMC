import { Calendar, Users, Car, Globe } from "lucide-react";

const cards = [
  { title: "Total Bookings", value: "1,257", icon: Calendar },
  { title: "Active Agents", value: "89", icon: Users },
  { title: "Service Providers", value: "156", icon: Car },
  { title: "Countries", value: "21", icon: Globe },
];

const DashboardCards = () => {
  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="dashboard-card-text">
                <p>{card.title}</p>
                <p>{card.value}</p>
              </div>
              <div className="dashboard-card-icon">
                <IconComponent size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
  
  export default DashboardCards;
  