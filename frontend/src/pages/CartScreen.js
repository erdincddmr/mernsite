import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import PaymentForm from '../components/PaymentForm';

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [openPayment, setOpenPayment] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = () => {
    setOpenPayment(true);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Alışveriş Sepeti
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          Sepetiniz boş
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item._id}>
                <Card>
                  <Grid container>
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              {item.price.toLocaleString('tr-TR')} TL
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item._id)}
                            sx={{ ml: 2 }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <IconButton
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                          <IconButton
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h5" gutterBottom>
              Sipariş Özeti
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Ara Toplam:</Typography>
              <Typography>{calculateTotal().toLocaleString('tr-TR')} TL</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Kargo:</Typography>
              <Typography>Ücretsiz</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Toplam:</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                {calculateTotal().toLocaleString('tr-TR')} TL
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handlePayment}
              sx={{
                backgroundColor: '#FFD700',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#FFC000'
                }
              }}
            >
              Siparişi Tamamla
            </Button>
          </Box>
        </>
      )}
      <PaymentForm
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        totalAmount={calculateTotal()}
      />
    </Container>
  );
};

export default CartScreen; 