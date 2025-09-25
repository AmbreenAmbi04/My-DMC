const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/verifyToken');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/protected', verifyToken, (request, response) => {
    response.json({ message: 'This is a protected route' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });