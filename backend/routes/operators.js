const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Get all operators with currency info
router.get('/', verifyToken, (req, res) => {
    const sql = `
        SELECT o.*, 
               c.code as currency_code, 
               c.symbol as currency_symbol
        FROM operators o 
        LEFT JOIN currencies c ON o.currency_id = c.id 
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch operators', details: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Get single operator by ID with currency info
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT o.*, 
               c.code as currency_code, 
               c.symbol as currency_symbol
        FROM operators o 
        LEFT JOIN currencies c ON o.currency_id = c.id 
        WHERE o.id = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch operator', details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Operator not found' });
        }
        res.json({ success: true, data: results[0] });
    });
});

// Create new operator
router.post('/', verifyToken, (req, res) => {
    const {
        name,
        code,
        currency_id,
        profit_margin_pct,
        logo_url,
        logo_url_opt,
        address,
        address_opt,
        show_logo_on_agent_voucher,
        show_logo_on_traveller_voucher,
        show_logo_on_invoice,
        show_logo_on_assignment,
        show_address_on_agent_voucher,
        show_address_on_traveller_voucher,
        show_address_on_invoice,
        show_address_on_assignment,
        status
    } = req.body;

    const sql = `
        INSERT INTO operators (
            name, code, currency_id, profit_margin_pct,
            logo_url, logo_url_opt, address, address_opt,
            show_logo_on_agent_voucher, show_logo_on_traveller_voucher,
            show_logo_on_invoice, show_logo_on_assignment,
            show_address_on_agent_voucher, show_address_on_traveller_voucher,
            show_address_on_invoice, show_address_on_assignment,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        code,
        currency_id,
        profit_margin_pct || 0.00,
        logo_url || null,
        logo_url_opt || null,
        address || null,
        address_opt || null,
        show_logo_on_agent_voucher ? 1 : 0,
        show_logo_on_traveller_voucher ? 1 : 0,
        show_logo_on_invoice ? 1 : 0,
        show_logo_on_assignment ? 1 : 0,
        show_address_on_agent_voucher ? 1 : 0,
        show_address_on_traveller_voucher ? 1 : 0,
        show_address_on_invoice ? 1 : 0,
        show_address_on_assignment ? 1 : 0,
        status || 'active'
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Operator code already exists' });
            }
            return res.status(500).json({ error: 'Failed to create operator', details: err.message });
        }
        res.json({ success: true, data: { id: results.insertId }, message: 'Operator created successfully' });
    });
});

// Update operator
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const {
        name,
        code,
        currency_id,
        profit_margin_pct,
        logo_url,
        logo_url_opt,
        address,
        address_opt,
        show_logo_on_agent_voucher,
        show_logo_on_traveller_voucher,
        show_logo_on_invoice,
        show_logo_on_assignment,
        show_address_on_agent_voucher,
        show_address_on_traveller_voucher,
        show_address_on_invoice,
        show_address_on_assignment,
        status
    } = req.body;

    const sql = `
        UPDATE operators SET 
            name = ?, code = ?, currency_id = ?, profit_margin_pct = ?,
            logo_url = ?, logo_url_opt = ?, address = ?, address_opt = ?,
            show_logo_on_agent_voucher = ?, show_logo_on_traveller_voucher = ?,
            show_logo_on_invoice = ?, show_logo_on_assignment = ?,
            show_address_on_agent_voucher = ?, show_address_on_traveller_voucher = ?,
            show_address_on_invoice = ?, show_address_on_assignment = ?, 
            status = ?
        WHERE id = ?
    `;

    const values = [
        name,
        code,
        currency_id,
        profit_margin_pct || 0.00,
        logo_url || null,
        logo_url_opt || null,
        address || null,
        address_opt || null,
        show_logo_on_agent_voucher ? 1 : 0,
        show_logo_on_traveller_voucher ? 1 : 0,
        show_logo_on_invoice ? 1 : 0,
        show_logo_on_assignment ? 1 : 0,
        show_address_on_agent_voucher ? 1 : 0,
        show_address_on_traveller_voucher ? 1 : 0,
        show_address_on_invoice ? 1 : 0,
        show_address_on_assignment ? 1 : 0,
        status || 'active',
        id
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Operator code already exists' });
            }
            return res.status(500).json({ error: 'Failed to update operator', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Operator not found' });
        }
        res.json({ success: true, message: 'Operator updated successfully' });
    });
});

// Delete operator
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM operators WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete operator', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Operator not found' });
        }
        res.json({ success: true, message: 'Operator deleted successfully' });
    });
});

// Get operator statistics
router.get('/stats/overview', verifyToken, (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_operators,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_operators,
            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_operators,
            COUNT(DISTINCT currency_id) as total_currencies
        FROM operators
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch operator statistics', details: err.message });
        }
        res.json({ success: true, data: results[0] });
    });
});

// Get available currencies for dropdown
router.get('/currency-details/currencies', verifyToken, (req, res) => {
    const sql = 'SELECT id, code, symbol FROM currencies ORDER BY code';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch currencies', details: err.message });
        }
        res.json({ success: true, data: results });
    });
});

module.exports = router;
