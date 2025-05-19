const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Tüm ürünleri listele
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tek ürün getir
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni ürün ekle
router.post('/', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      frameType: req.body.frameType,
      lensType: req.body.lensType,
      price: req.body.price,
      countInStock: req.body.countInStock,
      description: req.body.description,
      image: req.body.image
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ürün güncelle
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.model = req.body.model || product.model;
      product.frameType = req.body.frameType || product.frameType;
      product.lensType = req.body.lensType || product.lensType;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;
      product.image = req.body.image || product.image;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ürün sil
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Ürün silindi' });
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 