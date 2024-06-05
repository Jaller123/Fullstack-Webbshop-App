// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db'); // Import the db connection function
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Start the server only after a successful database connection
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database. Server not started.');
  }
};

startServer();
