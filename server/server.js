// index.js
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./src/routes/router'); // Import routes
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Node.js server is running!');
});

// API routes
app.use('/api', routes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
