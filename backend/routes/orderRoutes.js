const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User'); 

router.get('/', (req, res) => {
  res.send('Sipariş rotası çalışıyor');
});

router.post('/', async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, user } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'Sepet boş' });
    return;
  }

  try {
    const order = new Order({
      orderItems,
      user, 
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

router.get('/myorders/:userId', async (req, res) => {
  try {
    console.log('Siparişler getiriliyor, kullanıcı ID:', req.params.userId);
    
    if (!req.params.userId) {
      return res.status(400).json({ message: 'Kullanıcı ID\'si gerekli' });
    }

    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 }); // En yeni siparişler önce

    console.log('Bulunan siparişler:', orders);
    
    if (!orders || orders.length === 0) {
      return res.json([]); // Boş dizi döndür
    }

    res.json(orders);
  } catch (error) {
    console.error('Kullanıcı siparişlerini getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/request-return', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.returnStatus = req.body.returnStatus || 'Beklemede';
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