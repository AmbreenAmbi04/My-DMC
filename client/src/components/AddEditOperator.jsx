import { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AddEditOperator = ({ operator, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    currency_id: null,
    profit_margin_pct: 0.00,
    logo_url: '',
    logo_url_opt: '',
    address: '',
    address_opt: '',
    show_logo_on_agent_voucher: false,
    show_logo_on_traveller_voucher: false,
    show_logo_on_invoice: false,
    show_logo_on_assignment: false,
    show_address_on_agent_voucher: false,
    show_address_on_traveller_voucher: false,
    show_address_on_invoice: false,
    show_address_on_assignment: false,
    status: 'active'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [currencies, setCurrencies] = useState([]);

  // Fetch available currencies
  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/operators/currency-details/currencies`, {
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

  // Initialize form data when editing an existing operator
  useEffect(() => {
    if (operator) {
      setFormData({
        name: operator.name || '',
        code: operator.code || '',
        currency_id: operator.currency_id || null,
        profit_margin_pct: operator.profit_margin_pct || 0.00,
        logo_url: operator.logo_url || '',
        logo_url_opt: operator.logo_url_opt || '',
        address: operator.address || '',
        address_opt: operator.address_opt || '',
        show_logo_on_agent_voucher: Boolean(operator.show_logo_on_agent_voucher),
        show_logo_on_traveller_voucher: Boolean(operator.show_logo_on_traveller_voucher),
        show_logo_on_invoice: Boolean(operator.show_logo_on_invoice),
        show_logo_on_assignment: Boolean(operator.show_logo_on_assignment),
        show_address_on_agent_voucher: Boolean(operator.show_address_on_agent_voucher),
        show_address_on_traveller_voucher: Boolean(operator.show_address_on_traveller_voucher),
        show_address_on_invoice: Boolean(operator.show_address_on_invoice),
        show_address_on_assignment: Boolean(operator.show_address_on_assignment),
        status: operator.status || 'active'
      });
    }
  }, [operator]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCurrencyChange = (e) => {
    setFormData(prev => ({
      ...prev,
      currency_id: parseInt(e.target.value)
    }));
  };

  const handleFileUpload = async (files) => {
    setFileUploading(true);
    try {
      // Here you would typically upload to your file storage service
      // For now, we'll just simulate a file URL
      const formDataForUpload = new FormData();
      formDataForUpload.append('logo', files[0]);
      
      // Simulating file upload - replace with actual upload logic
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          logo_url: `https://example.com/logos/${files[0].name}`
        }));
        setFileUploading(false);
      }, 1000);
    } catch (error) {
      console.error('File upload failed:', error);
      setFileUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

    try {
      const token = localStorage.getItem('token');
      const url = operator ? `${API_URL}/api/operators/${operator.id}` : `${API_URL}/api/operators`;
      const method = operator ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: formData
      });

      if (response.data.success) {
        onSave();
      }
    } catch (error) {
      console.error('Failed to save operator:', error);
      alert('Failed to save operator. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark">
          {operator ? 'Edit Operator' : 'Add Operator'}
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
        {/* Operator Details Section */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">
            {operator ? 'Edit Operator Details' : 'OPERATOR DETAILS'}
          </h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Operator Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="E.g. MyCAB Pvt. Ltd."
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Operator Code</label>
              <input
                type="text"
                className="form-control"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="E.g. MYCAB"
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Operator Currency</label>
              <select
                className="form-select"
                name="currency_id"
                value={formData.currency_id || ''}
                onChange={handleCurrencyChange}
                required
              >
                <option value="">Select Currency</option>
                {currencies.map(currency => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Operator Profit Margin (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="profit_margin_pct"
                value={formData.profit_margin_pct}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Operator Logo Section */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Operator Logo</h6>
          <div className="row">
            <div className="col-md-6">
              <div
                className={`border-2 border-dashed rounded p-5 text-center ${dragActive ? 'border-primary bg-light' : 'border-secondary'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{ 
                  backgroundColor: dragActive ? '#f8f9fa' : '#f8f9fa',
                  cursor: dragActive ? 'copy' : 'default',
                  borderColor: '#dee2e6'
                }}
              >
                {fileUploading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status"></div>
                    <div>Uploading...</div>
                  </div>
                ) : formData.logo_url ? (
                  <div className="text-center">
                    <CheckCircle className="text-success mb-2" size={48} />
                    <div>Logo uploaded successfully</div>
                    <div className="small text-muted">{formData.logo_url}</div>
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <Upload className="text-muted mb-2" size={48} />
                    <div>Drag & Drop your files or <button type="button" className="btn btn-link p-0 text-decoration-underline">Browse</button></div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Logo Display Options:</label>
              <div className="mt-2">
                {[
                  { key: 'show_logo_on_agent_voucher', label: 'Agent booking voucher' },
                  { key: 'show_logo_on_traveller_voucher', label: 'Traveler booking voucher' },
                  { key: 'show_logo_on_invoice', label: 'Agent invoice' },
                  { key: 'show_logo_on_assignment', label: 'Service provider Assignment' },
                  { key: 'show_logo_on_assignment', label: 'Service provider invoice' }
                ].map((option, index) => (
                  <div key={`logo-option-${index}`} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={option.key}
                      checked={formData[option.key]}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label small">{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Operator Address Section */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Operator Address</h6>
          <div className="row">
            <div className="col-md-6">
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                placeholder="Enter operator address"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Address Display Options:</label>
              <div className="mt-2">
                {[
                  { key: 'show_address_on_agent_voucher', label: 'Agent booking voucher' },
                  { key: 'show_address_on_traveller_voucher', label: 'Traveler booking voucher' },
                  { key: 'show_address_on_invoice', label: 'Agent invoice' },
                  { key: 'show_address_on_assignment', label: 'Service provider Assignment' },
                  { key: 'show_address_on_assignment', label: 'Service provider invoice' }
                ].map((option, index) => (
                  <div key={`address-option-${index}`} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={option.key}
                      checked={formData[option.key]}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label small">{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Status</h6>
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
                Save Operator
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditOperator;
