const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wellness-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Connection string:', process.env.MONGO_URI ? 'Using environment variable' : 'Using default localhost');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Full error:', err);
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/drafts', require('./routes/drafts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Additional Debugging Steps

If you're still experiencing issues after implementing these changes, try these additional debugging steps:

1. **Clear Browser Cache and Local Storage**

   Open your browser's developer tools, go to the Application tab, select Local Storage, and clear all entries for your site. Then refresh the page.

2. **Check for CORS Issues**

   In your browser's developer tools, look for any CORS-related errors in the Console tab. If you see any, you might need to update your server's CORS configuration.

3. **Verify MongoDB Connection**

   Add more logging to your server.js file to ensure the MongoDB connection is working properly: