require('dotenv').config();

const db = require('./db');

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const operatorRoutes = require('./routes/operators');
const countryRoutes = require('./routes/countries');
const poiRoutes = require('./routes/pois');
const verifyToken = require('./middleware/verifyToken');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/pois', poiRoutes);

app.get('/api/protected', verifyToken, (request, response) => {
    response.json({ message: 'This is a protected route' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

app.get("/api/dashboard", verifyToken, (req, res) => {
    res.json({
      message: "Welcome to your dashboard!",
      data: [
        { id: 1, name: "Booking 1" },
        { id: 2, name: "Booking 2" }
      ]
    });
  });
  
  