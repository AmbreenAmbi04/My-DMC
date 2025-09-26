import { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import { Search, Plus, Filter, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import AddEditCountry from '../components/AddEditCountry';
import axios from 'axios';

const CountrySegmentManagement = () => {
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({
    total_countries: 0,
    active_countries: 0,
    inactive_countries: 0,
    total_segments: 0
  });
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch countries data
  const fetchCountries = async () => {
    try {
      // Temporarily disabled authentication - no token headers
      const response = await axios.get(`${API_URL}/api/countries`);
      setCountries(response.data.data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      // Temporarily disabled authentication - no token headers
      const response = await axios.get(`${API_URL}/api/countries/stats/overview`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchStats();
  }, []);

  // Filter countries based on search term and status
  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || country.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCountry = () => {
    setSelectedCountry(null);
    setShowAddEdit(true);
  };

  const handleEditCountry = (country) => {
    setSelectedCountry(country);
    setShowAddEdit(true);
  };

  const handleDeleteCountry = async (countryId) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        // Temporarily disabled authentication - no token headers
        await axios.delete(`${API_URL}/api/countries/${countryId}`);
        fetchCountries();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete country:', error);
        alert('Failed to delete country');
      }
    }
  };

  const handleCloseAddEdit = () => {
    setShowAddEdit(false);
    setSelectedCountry(null);
    fetchCountries();
    fetchStats();
  };

  if (showAddEdit) {
    return (
      <Layout>
        <AddEditCountry 
          country={selectedCountry} 
          onClose={handleCloseAddEdit}
          onSave={handleCloseAddEdit}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold text-dark mb-0">Country & Segment Management</h1>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-dark">{stats.total_countries}</div>
              <div className="text-muted">Total Countries</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-success">{stats.active_countries}</div>
              <div className="text-muted">Active Countries</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-danger">{stats.inactive_countries}</div>
              <div className="text-muted">Inactive Countries</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-dark">{stats.total_segments}</div>
              <div className="text-muted">Total Segments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="position-relative">
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button
            className="btn btn-primary"
            onClick={handleAddCountry}
          >
            <Plus size={18} className="me-2" />
            Add Country
          </button>
        </div>
      </div>

      {/* Countries Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 px-4 py-3 fw-semibold">COUNTRY</th>
                  <th className="border-0 px-4 py-3 fw-semibold">OPERATING CURRENCY</th>
                  <th className="border-0 px-4 py-3 fw-semibold">TIME ZONE</th>
                  <th className="border-0 px-4 py-3 fw-semibold">CITIES</th>
                  <th className="border-0 px-4 py-3 fw-semibold">SEGMENTS</th>
                  <th className="border-0 px-4 py-3 fw-semibold">STATUS</th>
                  <th className="border-0 px-4 py-3 fw-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <tr key={country.id}>
                      <td className="px-4 py-3">
                        <div className="fw-semibold">{country.name}</div>
                      </td>
                      <td className="px-4 py-3">{country.currency_code || 'N/A'}</td>
                      <td className="px-4 py-3">GMT{country.time_zone ? (country.time_zone.startsWith('+') ? country.time_zone : '+' + country.time_zone) : '+0'}</td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary text-white rounded-pill">
                          {country.cities_count || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary text-white rounded-pill">
                          {country.segments_count || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge rounded-pill text-uppercase ${
                          country.status === 'active' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {country.status}
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
                                onClick={() => handleEditCountry(country)}
                              >
                                <Edit2 size={16} className="me-2" />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteCountry(country.id)}
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
                    <td colSpan="7" className="text-center py-4 text-muted">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No countries found matching your criteria' 
                        : 'No countries found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className="page-item disabled">
              <span className="page-link">&laquo;</span>
            </li>
            <li className="page-item active">
              <span className="page-link">1</span>
            </li>
            <li className="page-item">
              <span className="page-link">&raquo;</span>
            </li>
          </ul>
        </nav>
      </div>
    </Layout>
  );
};

export default CountrySegmentManagement;
