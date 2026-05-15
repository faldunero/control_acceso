const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const mrzRoutes = require('./routes/mrz.routes');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

app.use('/api/mrz', mrzRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MRZ OCR backend escuchando en puerto ${PORT}`);
});