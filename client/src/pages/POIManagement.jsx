import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import AddEditPOI from '../components/AddEditPOI';
import axios from 'axios';

const POIManagement = () => {
    const [pois, setPois] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddEdit, setShowAddEdit] = useState(false);
    const [selectedPOI, setSelectedPOI] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');
    const [poisFilter, setPOISFilter] = useState('all'); // for poi type filter (airport/hotel/other)
    const [countries, setCountries] = useState([]);

    const fetchPOIs = async () => {
        try {
            setLoading(true);
            // Temporarily disabled authentication - no token headers
            const response = await axios.get('http://localhost:3000/api/pois');
            
            if (response.data.success) {
                setPois(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching POIs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Temporarily disabled authentication - no token headers
            const response = await axios.get('http://localhost:3000/api/pois/stats/overview');
            
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching POI stats:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            // Temporarily disabled authentication - no token headers
            const response = await axios.get('http://localhost:3000/api/pois/countries/list');
            
            if (response.data.success) {
                setCountries(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    useEffect(() => {
        fetchPOIs();
        fetchStats();
        fetchCountries();
    }, []);

    const filteredPOIs = pois.filter(poi => {
        const matchesSearch = poi.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || poi.status === statusFilter;
        const matchesCountry = countryFilter === 'all' || poi.country_name?.toLowerCase().includes(countryFilter.toLowerCase());
        const matchesPOI = poisFilter === 'all' || poi.poi_type === poisFilter;
        
        return matchesSearch && matchesStatus && matchesCountry && matchesPOI;
    });

    const handleAddPOI = () => {
        setSelectedPOI(null);
        setShowAddEdit(true);
    };

    const handleEditPOI = (poi) => {
        setSelectedPOI(poi);
        setShowAddEdit(true);
    };

    const handleDeletePOI = async (id) => {
        if (window.confirm('Are you sure you want to delete this POI?')) {
            try {
                // Temporarily disabled authentication - no token headers
                const response = await axios.delete(`http://localhost:3000/api/pois/${id}`);
                
                if (response.data.success) {
                    fetchPOIs();
                    fetchStats();
                }
            } catch (error) {
                console.error('Error deleting POI:', error);
            }
        }
    };

    const handleCloseAddEdit = () => {
        setShowAddEdit(false);
        setSelectedPOI(null);
    };

    const handlePOISaved = () => {
        fetchPOIs();
        fetchStats();
        handleCloseAddEdit();
    };

    // Show Add/Edit form if needed
    if (showAddEdit) {
        return (
            <Layout>
                <AddEditPOI 
                    poi={selectedPOI} 
                    onClose={handleCloseAddEdit}
                    onSave={handlePOISaved}
                    countries={countries}
                />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark">POI Management</h2>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="fs-4 fw-bold text-dark">{stats.total_pois || 0}</div>
                                <div className="text-muted">Total POIs</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="fs-4 fw-bold text-success">{stats.active_pois || 0}</div>
                                <div className="text-muted">Active POIs</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="fs-4 fw-bold text-danger">{stats.inactive_pois || 0}</div>
                                <div className="text-muted">Inactive POIs</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="fs-4 fw-bold text-dark">{stats.total_countries || 0}</div>
                                <div className="text-muted">Total Countries</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="d-flex gap-2">
                            <div className="flex-grow-1">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        placeholder="Search POI name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <select 
                                className="form-select"
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                style={{ width: '140px' }}
                            >
                                <option value="all">All Countries</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            <select 
                                className="form-select"
                                value={poisFilter}
                                onChange={(e) => setPOISFilter(e.target.value)}
                                style={{ width: '100px' }}
                            >
                                <option value="all">All Types</option>
                                <option value="airport">Airports</option>
                                <option value="hotel">Hotels</option>
                                <option value="other">Other</option>
                            </select>
                            <select 
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ width: '120px' }}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4 text-end">
                        <button 
                            className="btn btn-primary"
                            onClick={handleAddPOI}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                             Add POI
                        </button>
                    </div>
                </div>

                {/* POI Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="border-0 px-4 py-3 fw-semibold">POI NAME</th>
                                        <th className="border-0 px-4 py-3 fw-semibold">POI TYPE</th>
                                        <th className="border-0 px-4 py-3 fw-semibold">COUNTRY</th>
                                        <th className="border-0 px-4 py-3 fw-semibold">CITY/LOCATION</th>
                                        <th className="border-0 px-4 py-3 fw-semibold">STATUS</th>
                                        <th className="border-0 px-4 py-3 fw-semibold">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredPOIs.length > 0 ? (
                                        filteredPOIs.map((poi) => (
                                            <tr key={poi.id}>
                                                <td className="px-4 py-3">
                                                    <div className="fw-semibold">{poi.name}</div>
                                                    {poi.airport_code && (
                                                        <div className="small text-muted mt-1">
                                                            ({poi.airport_code})
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge rounded-pill ${
                                                        poi.poi_type === 'airport' ? 'bg-primary' : 
                                                        poi.poi_type === 'hotel' ? 'bg-warning' : 'bg-secondary'
                                                    } text-white text-uppercase`}>
                                                        {poi.poi_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{poi.country_name || 'N/A'}</td>
                                                <td className="px-4 py-3">{poi.location_name || 'N/A'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`badge rounded-pill text-uppercase ${
                                                        poi.status === 'active' ? 'bg-success' : 'bg-danger'
                                                    }`}>
                                                        {poi.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                        >
                                                            Actions
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleEditPOI(poi)}
                                                                >
                                                                    <Edit2 size={16} className="me-2" />
                                                                    Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item text-danger"
                                                                    onClick={() => handleDeletePOI(poi.id)}
                                                                >
                                                                    <Trash2 size={16} className="me-2" />
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                {searchTerm || statusFilter !== 'all' || countryFilter !== 'all' || poisFilter !== 'all'
                                                    ? 'No POIs found matching your criteria'
                                                    : 'No POIs found'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination placeholder */}
                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            <li className="page-item disabled">
                                <span className="page-link">‹</span>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">1</span>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">›</span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </Layout>
    );
};

export default POIManagement;