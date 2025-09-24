import { Calendar, Users, Car, Globe } from "lucide-react";

const cards = [
  { title: "Total Bookings", value: "1,257", icon: Calendar },
  { title: "Active Agents", value: "89", icon: Users },
  { title: "Service Providers", value: "156", icon: Car },
  { title: "Countries", value: "21", icon: Globe },
];

const DashboardCards = () => {
  return (
    <div className="row g-4 mb-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(to right, #7c3aed, #8b5cf6)'}}>
              <div className="card-body text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="card-text small mb-2 text-light">{card.title}</p>
                    <h3 className="card-title fw-bold mb-0">{card.value}</h3>
                  </div>
                  <div className="bg-white bg-opacity-25 p-3 rounded-3">
                    <IconComponent size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
  
  export default DashboardCards;
  