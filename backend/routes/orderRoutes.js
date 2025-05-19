const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User'); // Eğer sipariş oluşturan kullanıcıyı doğrudan route içinde bulacaksak

// Şimdilik örnek bir endpoint
router.get('/', (req, res) => {
  res.send('Sipariş rotası çalışıyor');
});

// Yeni sipariş oluştur
// POST /api/orders
router.post('/', async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, user } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'Sepet boş' });
    return;
  }

  try {
    const order = new Order({
      orderItems,
      user, // Frontend'den gelen kullanıcı ID'si direkt olarak atanıyor
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcının siparişlerini getir
// GET /api/orders/myorders/:userId
// Not: Normalde kimlik doğrulama middleware kullanılarak yapılması daha güvenlidir.
router.get('/myorders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (error) {
    console.error('Kullanıcı siparişlerini getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// İade talebi oluştur/güncelle
// PUT /api/orders/:id/request-return
router.put('/:id/request-return', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.returnStatus = req.body.returnStatus || 'Beklemede'; // Varsayılan olarak Beklemede
      order.returnReason = req.body.returnReason || '';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
  } catch (error) {
    console.error('İade talebi oluşturma/güncelleme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 