import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ZoomIn, ZoomOut, RestartAlt } from '@mui/icons-material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Notification from '../components/Notification';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct({
          ...data,
          image: data.image.replace('/images/', 'http://localhost:5000/images/')
        });
      } catch (error) {
        console.error('Ürün detayları yüklenirken hata oluştu:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
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

  if (!product) {
    return (
      <Container>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              centerOnInit={true}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '500px',
                        objectFit: 'contain'
                      }}
                    />
                  </TransformComponent>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Tooltip title="Yakınlaştır">
                      <IconButton 
                        onClick={() => zoomIn()} 
                        sx={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                          color: '#FFD700'
                        }}
                      >
                        <ZoomIn />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Uzaklaştır">
                      <IconButton 
                        onClick={() => zoomOut()} 
                        sx={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                          color: '#FFD700'
                        }}
                      >
                        <ZoomOut />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sıfırla">
                      <IconButton 
                        onClick={() => resetTransform()} 
                        sx={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                          color: '#FFD700'
                        }}
                      >
                        <RestartAlt />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
            </TransformWrapper>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.price.toLocaleString('tr-TR')} TL
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleAddToCart}
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
          </Box>
        </Grid>
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

export default ProductScreen; 