require('dotenv').config();
const express = require('express');
const cors = require('cors');
const classRoutes = require('./routes/classRoutes');
const routineRoutes = require('./routes/routineRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', classRoutes);
app.use('/api', routineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
