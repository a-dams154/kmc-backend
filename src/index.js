require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const scoreRoutes = require('./routes/scores');
const rankingRoutes = require('./routes/rankings');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/admin', adminRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/rankings', rankingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Student event score API is running' });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  });
