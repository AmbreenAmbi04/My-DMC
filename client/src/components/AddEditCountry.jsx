import { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import axios from 'axios';

const AddEditCountry = ({ country, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    assignment_currency_id: null,
    time_zone: '',
    booking_time_instant_hr: 0,
    booking_time_quote_hr: 0,
    status: 'active'
  });

  const [locations, setLocations] = useState([]);
  const [segments, setSegments] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Segment type options based on your schema
  const segmentTypes = [
    'Standard', 'Business', 'Luxury', 'MiniVan', 
    'SUV', 'Hatchback', 'Sedan', 'Crossover'
  ];

  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch available currencies
  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/countries/currency-details/currencies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrencies(response.data.data);
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Initialize form data when editing an existing country
  useEffect(() => {
    if (country) {
      setFormData({
        name: country.name || '',
        assignment_currency_id: country.assignment_currency_id || null,
        time_zone: country.time_zone || '',
        booking_time_instant_hr: country.booking_time_instant_hr || 0,
        booking_time_quote_hr: country.booking_time_quote_hr || 0,
        status: country.status || 'active'
      });
      
      if (country.locations) {
        setLocations(country.locations);
      }
      if (country.segments) {
        setSegments(country.segments);
      }
    }
  }, [country]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked ? 'active' : 'inactive' : value
    }));
  };

  const handleCurrencyChange = (e) => {
    setFormData(prev => ({
      ...prev,
      assignment_currency_id: parseInt(e.target.value)
    }));
  };

  // Location management functions
  const addLocation = () => {
    setLocations([...locations, { city_name: '', status: 'active', id: Math.random() }]);
  };

  const updateLocation = (index, field, value) => {
    const updatedLocations = locations.map((loc, i) => 
      i === index ? { ...loc, [field]: value } : loc
    );
    setLocations(updatedLocations);
  };

  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  // Segment management functions
  const addSegment = () => {
    setSegments([...segments, { 
      segment_type: 'Sedan', 
      vehicle_brand: '', 
      capacity_min: 1, 
      capacity_max: 3, 
      baggage: '',
      features: '',
      vehicle_sla: '',
      status: 'active',
      id: Math.random() 
    }]);
  };

  const updateSegment = (index, field, value) => {
    const updatedSegments = segments.map((seg, i) => 
      i === index ? { ...seg, [field]: value } : seg
    );
    setSegments(updatedSegments);
  };

  const removeSegment = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create or update country
      const countryData = { ...formData };
      const url = country ? `${API_URL}/api/countries/${country.id}` : `${API_URL}/api/countries`;
      const method = country ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: countryData
      });

      const countryId = response.data.data?.id || country.id;

      if (countryId) {
        // Handle locations
        if (!country || locations !== country.locations) {
          // Delete old locations if editing
          if (country && country.locations) {
            for (const location of country.locations) {
              if (location.id && !location.id.toString().startsWith('rand')) {
                await axios.delete(`${API_URL}/api/countries/locations/${location.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              }
            }
          }

          // Create new locations
          for (const location of locations) {
            if (location.city_name.trim()) {
              await axios.post(`${API_URL}/api/countries/${countryId}/locations`, {
                city_name: location.city_name,
                status: location.status
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          }
        }

        // Handle segments
        if (!country || segments !== country.segments) {
          // Delete old segments if editing
          if (country && country.segments) {
            for (const segment of country.segments) {
              if (segment.id && !segment.id.toString().startsWith('rand')) {
                await axios.delete(`${API_URL}/api/countries/segments/${segment.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              }
            }
          }

          // Create new segments
          for (const segment of segments) {
            if (segment.vehicle_brand.trim()) {
              await axios.post(`${API_URL}/api/countries/${countryId}/segments`, {
                segment_type: segment.segment_type,
                vehicle_brand: segment.vehicle_brand,
                capacity_min: parseInt(segment.capacity_min),
                capacity_max: parseInt(segment.capacity_max),
                baggage: segment.baggage,
                features: segment.features,
                vehicle_sla: segment.vehicle_sla,
                status: segment.status
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          }
        }

        onSave();
      }
    } catch (error) {
      console.error('Failed to save country:', error);
      alert('Failed to save country. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark">
          {country ? 'Edit Country' : 'Add Country'}
        </h4>
      </div>

      <form onSubmit={handleSubmit}>
        {/* COUNTRY DETAILS Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h6 className="mb-0 fw-bold">COUNTRY DETAILS</h6>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Country Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter country name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Assignment Currency</label>
                <select
                  className="form-select"
                  name="assignment_currency_id"
                  value={formData.assignment_currency_id || ''}
                  onChange={handleCurrencyChange}
                  required
                >
                  <option value="">Select Currency</option>
                  {currencies.map(currency => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Time Zone</label>
                <input
                  type="text"
                  className="form-control"
                  name="time_zone"
                  value={formData.time_zone}
                  onChange={handleInputChange}
                  placeholder="GMT+2"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Instant Booking (hrs)</label>
                <input
                  type="number"
                  className="form-control"
                  name="booking_time_instant_hr"
                  value={formData.booking_time_instant_hr}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Quote Booking (hrs)</label>
                <input
                  type="number"
                  className="form-control"
                  name="booking_time_quote_hr"
                  value={formData.booking_time_quote_hr}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="status_check"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      status: e.target.checked ? 'active' : 'inactive'
                    }))}
                  />
                  <label className="form-check-label">Active</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CITIES / LOCATIONS Section */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">CITIES / LOCATIONS</h6>
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={addLocation}
            >
              <Plus size={18} />
              Add City
            </button>
          </div>
          <div className="card-body">
            {locations.map((location, index) => (
              <div key={location.id || index} className="row mb-3 align-items-center">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g. New York"
                    value={location.city_name}
                    onChange={(e) => updateLocation(index, 'city_name', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={location.status === 'active'}
                      onChange={(e) => updateLocation(index, 'status', e.target.checked ? 'active' : 'inactive')}
                    />
                    <label className="form-check-label">Active</label>
                  </div>
                </div>
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeLocation(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEGMENT DETAILS Section */}
        <div className="card mb-4">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">SEGMENT DETAILS</h6>
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={addSegment}
            >
              <Plus size={18} />
              Add Segment
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Segment Type</th>
                    <th>Vehicle Brand</th>
                    <th>Seating Capacity</th>
                    <th>Baggage</th>
                    <th>Features</th>
                    <th>Vehicle SLA</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((segment, index) => (
                    <tr key={segment.id || index}>
                      <td>
                        <select
                          className="form-select"
                          value={segment.segment_type}
                          onChange={(e) => updateSegment(index, 'segment_type', e.target.value)}
                        >
                          {segmentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g. Toyota Camry"
                          value={segment.vehicle_brand}
                          onChange={(e) => updateSegment(index, 'vehicle_brand', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g. 1-3"
                          value={`${segment.capacity_min}-${segment.capacity_max}`}
                          onChange={(e) => {
                            const values = e.target.value.split('-');
                            updateSegment(index, 'capacity_min', values[0] || 1);
                            updateSegment(index, 'capacity_max', values[1] || 3);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g. 2 Large"
                          value={segment.baggage}
                          onChange={(e) => updateSegment(index, 'baggage', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g. Sunroof"
                          value={segment.features}
                          onChange={(e) => updateSegment(index, 'features', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="E.g. N/A"
                          value={segment.vehicle_sla}
                          onChange={(e) => updateSegment(index, 'vehicle_sla', e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={segment.status === 'active'}
                            onChange={(e) => updateSegment(index, 'status', e.target.checked ? 'active' : 'inactive')}
                          />
                          <label className="form-check-label">Active</label>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeSegment(index)}
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" />
                Save Country
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCountry;
