import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Notification from '../components/Notification';

const HomeScreen = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const productsWithFixedImages = data.map(product => ({
          ...product,
          image: product.image.replace('/images/', 'http://localhost:5000/images/')
        }));
        setProducts(productsWithFixedImages);
      } catch (error) {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({
      open: true,
      message: 'Ürün sepete eklendi!',
      severity: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Gözlük Koleksiyonu
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {product.price.toLocaleString('tr-TR')} TL
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                  sx={{
                    backgroundColor: '#FFD700',
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: '#FFC000'
                    }
                  }}
                >
                  Sepete Ekle
                </Button>
                <Button
                  component={Link}
                  to={`/product/${product._id}`}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: '#FFD700',
                    color: '#FFD700',
                    '&:hover': {
                      borderColor: '#FFC000',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    }
                  }}
                >
                  Detaylı İncele
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Container>
  );
};

export default HomeScreen; 