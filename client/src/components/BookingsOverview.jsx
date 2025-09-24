import { ChevronDown } from "lucide-react";

const BookingsOverview = () => {
  const bookings = [
    { name: "MyDMC", count: "8761" },
    { name: "MyDMC UAE", count: "4567" },
  ];

  return (
    <div className="bookings-overview">
      <h2>BOOKINGS OVERVIEW</h2>
      <div className="bookings-table">
        {bookings.map((booking, index) => (
          <div key={index} className="bookings-row">
            <div className="bookings-name">
              <span>{booking.name}</span>
            </div>
            <div className="bookings-count">
              <span>{booking.count}</span>
            </div>
            <div className="bookings-actions">
              <button>
                Actions
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
  
  export default BookingsOverview;
  