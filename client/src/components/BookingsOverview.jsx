import { ChevronDown } from "lucide-react";

const BookingsOverview = () => {
  const bookings = [
    { name: "MyDMC", count: "8761" },
    { name: "MyDMC UAE", count: "4567" },
  ];

  return (
    <div>
      <h2 className="h5 fw-bold text-dark mb-4">BOOKINGS OVERVIEW</h2>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {bookings.map((booking, index) => (
            <div key={index} className="d-flex align-items-center justify-content-between p-4 border-bottom">
              <div className="flex-grow-1">
                <span className="fw-medium text-dark">{booking.name}</span>
              </div>
              <div className="flex-grow-1 text-center">
                <span className="fw-medium text-dark">{booking.count}</span>
              </div>
              <div className="flex-grow-1 text-end">
                <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center">
                  Actions
                  <ChevronDown size={16} className="ms-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  
  export default BookingsOverview;
  