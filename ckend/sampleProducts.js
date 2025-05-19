const mongoose = require('mongoose');
const Product = require('./models/Product');

const images = [
  '/images/police.jpg',
  '/images/oakley.jpg',
  '/images/persol.jpg',
  '/images/versace.jpg',
  '/images/versace oval.webp',
  '/images/tomford.jpg',
  '/images/Persol Oval.jpeg',
  '/images/Persol Square.jpeg',
  '/images/Police Pilot.webp',
  '/images/Oakley Wayfarer.jpg'
];

const products = [
  {
    name: 'Police Pilot',
    brand: 'Police',
    model: 'Pilot',
    frameType: 'Metal',
    lensType: 'Polarize',
    price: 2500,
    countInStock: 10,
    description: 'Klasik metal çerçeveli, polarize camlı Police gözlük.',
    image: '/images/Police Pilot.webp'
  },
  {
    name: 'Oakley Wayfarer',
    brand: 'Oakley',
    model: 'Wayfarer',
    frameType: 'Plastik',
    lensType: 'UV Koruma',
    price: 1800,
    countInStock: 7,
    description: 'Spor tarzı, plastik çerçeveli, UV korumalı Oakley gözlük.',
    image: '/images/Oakley Wayfarer.jpg'
  },
  {
    name: 'Persol Square',
    brand: 'Persol',
    model: 'Square',
    frameType: 'Acetat',
    lensType: 'Gri Cam',
    price: 3200,
    countInStock: 5,
    description: 'İtalyan tasarımı, asetat çerçeveli, gri camlı Persol gözlük.',
    image: '/images/Persol Square.jpeg'
  },
  {
    name: 'Versace Classic',
    brand: 'Versace',
    model: 'Classic',
    frameType: 'Metal',
    lensType: 'Kahverengi Cam',
    price: 4200,
    countInStock: 8,
    description: 'Şık metal çerçeveli, kahverengi camlı Versace gözlük.',
    image: '/images/versace.jpg'
  },
  {
    name: 'Versace Oval',
    brand: 'Versace',
    model: 'Oval',
    frameType: 'Plastik',
    lensType: 'Yeşil Cam',
    price: 3900,
    countInStock: 6,
    description: 'Modern plastik çerçeveli, yeşil camlı Versace gözlük.',
    image: '/images/versace oval.webp'
  },
  {
    name: 'Tom Ford Classic',
    brand: 'Tom Ford',
    model: 'Classic',
    frameType: 'Acetat',
    lensType: 'Mavi Cam',
    price: 3500,
    countInStock: 4,
    description: 'Lüks asetat çerçeveli, mavi camlı Tom Ford gözlük.',
    image: '/images/tomford.jpg'
  },
  {
    name: 'Persol Oval',
    brand: 'Persol',
    model: 'Oval',
    frameType: 'Plastik',
    lensType: 'Gri Cam',
    price: 1200,
    countInStock: 12,
    description: 'Uygun fiyatlı plastik çerçeveli, gri camlı Persol gözlük.',
    image: '/images/Persol Oval.jpeg'
  },
  {
    name: 'Persol Square Classic',
    brand: 'Persol',
    model: 'Square Classic',
    frameType: 'Metal',
    lensType: 'Siyah Cam',
    price: 2100,
    countInStock: 9,
    description: 'Spor metal çerçeveli, siyah camlı Persol gözlük.',
    image: '/images/Persol Square.jpeg'
  },
  {
    name: 'Police Pilot Premium',
    brand: 'Police',
    model: 'Pilot Premium',
    frameType: 'Plastik',
    lensType: 'Kahverengi Cam',
    price: 2700,
    countInStock: 7,
    description: 'Klasik plastik çerçeveli, kahverengi camlı Police gözlük.',
    image: '/images/Police Pilot.webp'
  },
  {
    name: 'Oakley Wayfarer Premium',
    brand: 'Oakley',
    model: 'Wayfarer Premium',
    frameType: 'Acetat',
    lensType: 'Yeşil Cam',
    price: 2300,
    countInStock: 6,
    description: 'Şık asetat çerçeveli, yeşil camlı Oakley gözlük.',
    image: '/images/Oakley Wayfarer.jpg'
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin:123@gozlukcu-cluster0.vycctfm.mongodb.net/?retryWrites=true&w=majority');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Örnek ürünler başarıyla eklendi!');
    process.exit();
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
};

seedProducts(); 