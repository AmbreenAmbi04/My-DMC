const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Get all POIs with country and location info, and statistics
router.get('/', verifyToken, (req, res) => {
    const sql = `
        SELECT 
            p.*,
            c.name as country_name,
            l.city_name as location_name,
            c.code as country_code
        FROM pois p 
        LEFT JOIN countries c ON p.country_id = c.id 
        LEFT JOIN locations l ON p.location_id = l.id
        ORDER BY p.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch POIs', details: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Get single POI by ID with country and location details
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            p.*,
            c.name as country_name,
            l.city_name as location_name,
            c.code as country_code
        FROM pois p 
        LEFT JOIN countries c ON p.country_id = c.id 
        LEFT JOIN locations l ON p.location_id = l.id 
        WHERE p.id = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch POI', details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'POI not found' });
        }
        res.json({ success: true, data: results[0] });
    });
});

// Create POI
router.post('/', verifyToken, (req, res) => {
    const {
        poi_type,
        country_id,
        location_id,
        name,
        airport_code,
        address,
        meeting_point,
        status = 'active'
    } = req.body;

    const sql = `
        INSERT INTO pois (
            poi_type, country_id, location_id, name, 
            airport_code, address, meeting_point, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        poi_type,
        country_id,
        location_id,
        name,
        airport_code || null,
        address || null,
        meeting_point || null,
        status
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create POI', details: err.message });
        }
        res.json({ success: true, data: { id: results.insertId }, message: 'POI created successfully' });
    });
});

// Update POI
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const {
        poi_type,
        country_id,
        location_id,
        name,
        airport_code,
        address,
        meeting_point,
        status
    } = req.body;

    const sql = `
        UPDATE pois SET 
            poi_type = ?, country_id = ?, location_id = ?, name = ?,
            airport_code = ?, address = ?, meeting_point = ?, status = ?
        WHERE id = ?
    `;

    const values = [
        poi_type,
        country_id,
        location_id,
        name,
        airport_code || null,
        address || null,
        meeting_point || null,
        status,
        id
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update POI', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'POI not found' });
        }
        res.json({ success: true, message: 'POI updated successfully' });
    });
});

// Delete POI
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pois WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete POI', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'POI not found' });
        }
        res.json({ success: true, message: 'POI deleted successfully' });
    });
});

// Get POI statistics
router.get('/stats/overview', verifyToken, (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_pois,
            SUM(CASE WHEN p.status = 'active' THEN 1 ELSE 0 END) as active_pois,
            SUM(CASE WHEN p.status = 'inactive' THEN 1 ELSE 0 END) as inactive_pois,
            COUNT(DISTINCT c.id) as total_countries
        FROM pois p 
        LEFT JOIN countries c ON p.country_id = c.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch POI statistics', details: err.message });
        }
        res.json({ success: true, data: results[0] });
    });
});

// Get countries for dropdown
router.get('/countries/list', verifyToken, (req, res) => {
    const sql = 'SELECT id, name FROM countries WHERE status = "active" ORDER BY name';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch countries', details: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Get locations by country
router.get('/countries/:countryId/locations', verifyToken, (req, res) => {
    const { countryId } = req.params;
    const sql = 'SELECT id, city_name FROM locations WHERE country_id = ? AND status = "active" ORDER BY city_name';
    db.query(sql, [countryId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch locations', details: err.message });
        }
        res.json({ success: true, data: results });
    });
});

module.exports = router;
