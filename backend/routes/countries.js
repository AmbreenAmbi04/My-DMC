const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Get all countries with currency info, locations, and segments
router.get('/', verifyToken, (req, res) => {
    const sql = `
        SELECT 
            c.*,
            cu.code as currency_code,
            cu.symbol as currency_symbol,
            COUNT(DISTINCT l.id) as cities_count,
            COUNT(DISTINCT s.id) as segments_count
        FROM countries c 
        LEFT JOIN currencies cu ON c.assignment_currency_id = cu.id 
        LEFT JOIN locations l ON c.id = l.country_id AND l.status = 'active'
        LEFT JOIN segments s ON c.id = s.country_id AND s.status = 'active'
        GROUP BY c.id
        ORDER BY c.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch countries', details: err.message });
        }
        res.json({ success: true, data: results });
    });
});

// Get single country with locations and segments
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    
    // Get country details
    const countrySql = `
        SELECT c.*, cu.code as currency_code, cu.symbol as currency_symbol
        FROM countries c 
        LEFT JOIN currencies cu ON c.assignment_currency_id = cu.id 
        WHERE c.id = ?
    `;
    
    // Get locations
    const locationsSql = 'SELECT * FROM locations WHERE country_id = ? ORDER BY created_at';
    
    // Get segments
    const segmentsSql = 'SELECT * FROM segments WHERE country_id = ? ORDER BY created_at';

    db.query(countrySql, [id], (err, countryResults) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch country', details: err.message });
        }
        if (countryResults.length === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }

        const country = countryResults[0];
        
        // Get locations
        db.query(locationsSql, [id], (err, locationResults) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch locations', details: err.message });
            }
            
            // Get segments
            db.query(segmentsSql, [id], (err, segmentResults) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch segments', details: err.message });
                }
                
                country.locations = locationResults;
                country.segments = segmentResults;
                
                res.json({ success: true, data: country });
            });
        });
    });
});

// Create country
router.post('/', verifyToken, (req, res) => {
    const {
        name,
        assignment_currency_id,
        time_zone,
        booking_time_instant_hr = 0,
        booking_time_quote_hr = 0,
        status = 'active'
    } = req.body;

    const sql = `
        INSERT INTO countries (
            name, assignment_currency_id, time_zone, 
            booking_time_instant_hr, booking_time_quote_hr, status
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        assignment_currency_id,
        time_zone,
        booking_time_instant_hr,
        booking_time_quote_hr,
        status
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create country', details: err.message });
        }
        res.json({ success: true, data: { id: results.insertId }, message: 'Country created successfully' });
    });
});

// Update country
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const {
        name,
        assignment_currency_id,
        time_zone,
        booking_time_instant_hr,
        booking_time_quote_hr,
        status
    } = req.body;

    const sql = `
        UPDATE countries SET 
            name = ?, assignment_currency_id = ?, time_zone = ?, 
            booking_time_instant_hr = ?, booking_time_quote_hr = ?, status = ?
        WHERE id = ?
    `;

    const values = [
        name,
        assignment_currency_id,
        time_zone,
        booking_time_instant_hr || 0,
        booking_time_quote_hr || 0,
        status,
        id
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update country', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.json({ success: true, message: 'Country updated successfully' });
    });
});

// Delete country
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM countries WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete country', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.json({ success: true, message: 'Country deleted successfully' });
    });
});

// Get country statistics
router.get('/stats/overview', verifyToken, (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_countries,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_countries,
            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_countries,
            (SELECT COUNT(*) FROM segments WHERE status = 'active') as total_segments
        FROM countries
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch country statistics', details: err.message });
        }
        res.json({ success: true, data: results[0] });
    });
});

// Location management endpoints
router.post('/:id/locations', verifyToken, (req, res) => {
    const { id } = req.params;
    const { city_name, status = 'active' } = req.body;

    const sql = 'INSERT INTO locations (country_id, city_name, status) VALUES (?, ?, ?)';
    
    db.query(sql, [id, city_name, status], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create location', details: err.message });
        }
        res.json({ success: true, data: { id: results.insertId }, message: 'Location created successfully' });
    });
});

router.put('/locations/:locationId', verifyToken, (req, res) => {
    const { locationId } = req.params;
    const { city_name, status } = req.body;

    const sql = 'UPDATE locations SET city_name = ?, status = ? WHERE id = ?';
    
    db.query(sql, [city_name, status, locationId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update location', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json({ success: true, message: 'Location updated successfully' });
    });
});

router.delete('/locations/:locationId', verifyToken, (req, res) => {
    const { locationId } = req.params;
    const sql = 'DELETE FROM locations WHERE id = ?';
    
    db.query(sql, [locationId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete location', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json({ success: true, message: 'Location deleted successfully' });
    });
});

// Segment management endpoints
router.post('/:id/segments', verifyToken, (req, res) => {
    const { id } = req.params;
    const {
        segment_type,
        vehicle_brand,
        capacity_min,
        capacity_max,
        baggage,
        features,
        vehicle_sla,
        status = 'active'
    } = req.body;

    const sql = `
        INSERT INTO segments (
            country_id, segment_type, vehicle_brand, capacity_min, 
            capacity_max, baggage, features, vehicle_sla, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [id, segment_type, vehicle_brand, capacity_min, capacity_max, baggage, features, vehicle_sla, status];
    
    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create segment', details: err.message });
        }
        res.json({ success: true, data: { id: results.insertId }, message: 'Segment created successfully' });
    });
});

router.put('/segments/:segmentId', verifyToken, (req, res) => {
    const { segmentId } = req.params;
    const {
        segment_type,
        vehicle_brand,
        capacity_min,
        capacity_max,
        baggage,
        features,
        vehicle_sla,
        status
    } = req.body;

    const sql = `
        UPDATE segments SET 
            segment_type = ?, vehicle_brand = ?, capacity_min = ?, 
            capacity_max = ?, baggage = ?, features = ?, vehicle_sla = ?, status = ?
        WHERE id = ?
    `;
    
    const values = [segment_type, vehicle_brand, capacity_min, capacity_max, baggage, features, vehicle_sla, status, segmentId];
    
    db.query(sql, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update segment', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Segment not found' });
        }
        res.json({ success: true, message: 'Segment updated successfully' });
    });
});

router.delete('/segments/:segmentId', verifyToken, (req, res) => {
    const { segmentId } = req.params;
    const sql = 'DELETE FROM segments WHERE id = ?';
    
    db.query(sql, [segmentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete segment', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Segment not found' });
        }
        res.json({ success: true, message: 'Segment deleted successfully' });
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
