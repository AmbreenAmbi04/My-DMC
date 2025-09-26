import { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import { Search, Plus, Filter, ChevronDown, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import AddEditOperator from '../components/AddEditOperator';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const OperatorManagement = () => {
  const [operators, setOperators] = useState([]);
  const [stats, setStats] = useState({
    total_operators: 0,
    active_operators: 0,
    inactive_operators: 0,
    total_currencies: 0
  });
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Get auth context (temporarily disabled)
  // const { getAuthHeaders } = useAuth();
  
  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch operators data
  const fetchOperators = async () => {
    try {
      // Temporarily disabled authentication - no token headers
      const response = await axios.get(`${API_URL}/api/operators`);
      setOperators(response.data.data);
    } catch (error) {
      console.error('Failed to fetch operators:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      // Temporarily disabled authentication - no token headers
      const response = await axios.get(`${API_URL}/api/operators/stats/overview`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchOperators();
    fetchStats();
  }, []);

  // Filter operators based on search term and status
  const filteredOperators = operators.filter(operator => {
    const matchesSearch = operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operator.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || operator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOperator = () => {
    setSelectedOperator(null);
    setShowAddEdit(true);
  };

  const handleEditOperator = (operator) => {
    setSelectedOperator(operator);
    setShowAddEdit(true);
  };

  const handleDeleteOperator = async (operatorId) => {
    if (window.confirm('Are you sure you want to delete this operator?')) {
      try {
        // Temporarily disabled authentication - no token headers
        await axios.delete(`${API_URL}/api/operators/${operatorId}`);
        fetchOperators();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete operator:', error);
        alert('Failed to delete operator');
      }
    }
  };

  const handleCloseAddEdit = () => {
    setShowAddEdit(false);
    setSelectedOperator(null);
    fetchOperators();
    fetchStats();
  };

  if (showAddEdit) {
    return (
      <Layout>
        <AddEditOperator 
          operator={selectedOperator} 
          onClose={handleCloseAddEdit}
          onSave={handleCloseAddEdit}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold text-dark mb-0">Operator Management</h1>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-dark">{stats.total_operators}</div>
              <div className="text-muted">Total Operators</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-success">{stats.active_operators}</div>
              <div className="text-muted">Active Operators</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-danger">{stats.inactive_operators}</div>
              <div className="text-muted">Inactive Operators</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="fs-4 fw-bold text-dark">{stats.total_currencies}</div>
              <div className="text-muted">Total Currencies</div>
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
            onClick={handleAddOperator}
          >
            <Plus size={18} className="me-2" />
            Add Operator
          </button>
        </div>
      </div>

      {/* Operators Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 px-4 py-3 fw-semibold">OPERATOR DETAILS</th>
                  <th className="border-0 px-4 py-3 fw-semibold">OPERATOR ID</th>
                  <th className="border-0 px-4 py-3 fw-semibold">STATUS</th>
                  <th className="border-0 px-4 py-3 fw-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOperators.length > 0 ? (
                  filteredOperators.map((operator) => (
                    <tr key={operator.id}>
                      <td className="px-4 py-3">
                        <div className="fw-semibold">{operator.name}</div>
                      </td>
                      <td className="px-4 py-3">{operator.code}</td>
                      <td className="px-4 py-3">
                        <span className={`badge rounded-pill text-uppercase ${
                          operator.status === 'active' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {operator.status}
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
                                onClick={() => handleEditOperator(operator)}
                              >
                                <Edit2 size={16} className="me-2" />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteOperator(operator.id)}
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
                    <td colSpan="4" className="text-center py-4 text-muted">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No operators found matching your criteria' 
                        : 'No operators found'}
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

export default OperatorManagement;
