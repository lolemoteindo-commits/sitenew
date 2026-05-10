const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || 'http://46.250.239.109:6020';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests' }
});

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

app.post('/api/login', (req, res) => {
    res.json({ success: true, message: 'Login successful' });
});

app.post('/api/add-days', async (req, res) => {
    const { uid, days } = req.body;
    if (!uid || !days) return res.status(400).json({ error: 'UID and days required' });
    
    try {
        const apiUrl = `${API_BASE_URL}/uid?add=${encodeURIComponent(uid)}&days=${encodeURIComponent(days)}`;
        const response = await fetch(apiUrl);
        const data = await response.text();
        res.json({ success: true, uid, days, response: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to API' });
    }
});

app.post('/api/verify-session', (req, res) => res.json({ valid: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
