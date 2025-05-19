const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Statik dosyaları serve et
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// API rotaları
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:123@gozlukcu-cluster0.vycctfm.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Production ortamında frontend dosyalarını serve et
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 