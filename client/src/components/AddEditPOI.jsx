import React, { useState, useEffect } from 'react';
import { Save, MapPin, Plane, Building } from 'lucide-react';
import axios from 'axios';

const AddEditPOI = ({ poi, onClose, onSave, countries = [] }) => {
    const [formData, setFormData] = useState({
        poi_type: '',
        country_id: '',
        location_id: '',
        name: '',
        airport_code: '',
        address: '',
        meeting_point: '',
        status: 'active'
    });
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);

    useEffect(() => {
        if (poi) {
            // Populate form for editing
            setFormData({
                poi_type: poi.poi_type || '',
                country_id: poi.country_id || '',
                location_id: poi.location_id || '',
                name: poi.name || '',
                airport_code: poi.airport_code || '',
                address: poi.address || '',
                meeting_point: poi.meeting_point || '',
                status: poi.status || 'active'
            });

            // Load locations for the country
            if (poi.country_id) {
                loadLocations(poi.country_id);
            }
        }
    }, [poi]);

    const loadLocations = async (countryId) => {
        try {
            setLoadingLocations(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:3000/api/pois/countries/${countryId}/locations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setLocations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoadingLocations(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCountryChange = async (e) => {
        const countryId = e.target.value;
        setFormData(prev => ({
            ...prev,
            country_id: countryId,
            location_id: '' // Reset location when country changes
        }));

        if (countryId) {
            await loadLocations(countryId);
        }
    };

    const getPOITypeIcon = (type) => {
        switch (type) {
            case 'airport':
                return <Plane size={16} className="me-2" />;
            case 'hotel':
                return <Building size={16} className="me-2" />;
            default:
                return <MapPin size={16} className="me-2" />;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            
            if (poi) {
                // Update POI
                const response = await axios.put(`http://localhost:3000/api/pois/${poi.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    onSave();
                }
            } else {
                // Create POI
                const response = await axios.post('http://localhost:3000/api/pois', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    onSave();
                }
            }
        } catch (error) {
            console.error('Error saving POI:', error);
            alert('An error occurred while saving the POI');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">
                    {poi ? 'Edit POI' : 'Add POI'}
                </h2>
            </div>

            {/* POI Details Form */}
            <div className="bg-white rounded shadow-sm">
                {/* POI Details Section */}
                <div className="border-bottom">
                    <div className="bg-primary text-white px-4 py-3">
                        <div className="d-flex align-items-center">
                            <MapPin size={20} className="me-3" />
                            <span className="fw-semibold fs-5">POI DETAILS</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="row">
                        {/* POI Type */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">POI Type</label>
                            <select
                                className="form-select"
                                name="poi_type"
                                value={formData.poi_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select POI Type</option>
                                <option value="airport">Airport</option>
                                <option value="hotel">Hotel</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Country & Location Row */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">POI Country</label>
                            <select
                                className="form-select"
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleCountryChange}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        {/* Location/City */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">POI City</label>
                            <select
                                className="form-select"
                                name="location_id"
                                value={formData.location_id}
                                onChange={handleInputChange}
                                required
                                disabled={loadingLocations || !formData.country_id}
                            >
                                <option value="">Select City</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.city_name}
                                    </option>
                                ))}
                            </select>
                            {loadingLocations && (
                                <div className="small text-muted mt-1">
                                    Loading cities...
                                </div>
                            )}
                        </div>

                        {/* POI Name */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">POI Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="E.g. King Khalid International Airport"
                                required
                            />
                        </div>
                    </div>

                    {/* Airport Code - only show for airports */}
                    {formData.poi_type === 'airport' && (
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">Airport Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="airport_code"
                                    value={formData.airport_code}
                                    onChange={handleInputChange}
                                    placeholder="E.g. RUH"
                                />
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">POI Address</label>
                            <textarea
                                className="form-control"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Include full address"
                            />
                        </div>

                        {/* Meeting Point */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">POI Meeting Point</label>
                            <textarea
                                className="form-control"
                                name="meeting_point"
                                value={formData.meeting_point}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="E.g. Waiting Lounge"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status === 'active'}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        status: e.target.checked ? 'active' : 'inactive'
                                    }))}
                                />
                                <label className="form-check-label">
                                    Active (Enable this POI)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="d-flex justify-content-end gap-3">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || loadingLocations}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {getPOITypeIcon(formData.poi_type || 'poi')}
                                    <Save size={16} className="me-2" />
                                    {poi ? 'Update POI' : 'Add POI'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditPOI;
