const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Yeni kullanıcı oluşturma
    const user = new User({
      name,
      email,
      password // düz şekilde gönder
    });

    await user.save();
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  try {
    console.log('Login isteği geldi:', req.body);

    const { email, password } = req.body;

    // Kullanıcı kontrolü
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Geçersiz şifre:', email);
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    console.log('Giriş başarılı:', email);
    res.json({ message: 'Giriş başarılı', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log('Login hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı profilini getir
router.get('/profile/:id', async (req, res) => {
  try {
    console.log('Profil isteği geldi, ID:', req.params.id);

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      console.log('Profil bulunamadı, ID:', req.params.id);
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    console.log('Profil başarıyla bulundu:', user.email);
    res.json(user);
  } catch (error) {
    console.log('Profil hata:', error);
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı profilini güncelle
router.put('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Eğer email değiştiyse benzersizliğini kontrol et
      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
        }
      }

      const updatedUser = await user.save();
      res.json({ message: 'Profil başarıyla güncellendi', user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email } });
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı şifresini değiştir
router.put('/password/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (req.body.password) {
        user.password = req.body.password;
        const updatedUser = await user.save();
        res.json({ message: 'Şifre başarıyla güncellendi' });
      } else {
        res.status(400).json({ message: 'Yeni şifre boş olamaz' });
      }
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// JWT token oluşturma
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gizlianahtar123', {
    expiresIn: '30d'
  });
};

module.exports = router; 