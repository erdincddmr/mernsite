const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Statik dosyaları servis et
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Test endpoint'i
app.get('/test-image', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/images/Police Pilot.webp'));
});

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://admin:123@gozlukcu-cluster0.vycctfm.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 