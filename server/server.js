const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // <-- add this
const routes = require('./src/routes/router');
const { connectDB } = require('./src/api/config/db');
const masterRoutes = require('./src/controllers/master');

dotenv.config();

// Initialize MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Allow requests from React (5173)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Node.js server is running!');
});

// API routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
