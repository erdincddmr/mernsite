import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ open, onClose, totalAmount }) => {
  const { cartItems, clearCart } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
   
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Geçerli bir kart numarası giriniz (16 haneli)';
    }

    
    if (!/^[A-Za-zğüşıöçĞÜŞİÖÇ\s]{5,50}$/.test(formData.cardHolder)) {
      newErrors.cardHolder = 'Geçerli bir kart sahibi adı giriniz';
    }

   
    if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth)) {
      newErrors.expiryMonth = 'Geçerli bir ay giriniz (01-12)';
    }

    
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.expiryYear);
    if (year < currentYear || year > currentYear + 10) {
      newErrors.expiryYear = 'Geçerli bir yıl giriniz';
    }

 
    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'Geçerli bir CVV giriniz (3 haneli)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      console.log('userInfo from localStorage:', userInfo);
      
      if (!userInfo || !userInfo.id) {
        alert('Sipariş oluşturmak için giriş yapmalısınız.');
        navigate('/login');
        return;
      }

      const order = {
        orderItems: cartItems.map(item => ({ 
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id, 
        })),
        totalPrice: totalAmount,
        shippingAddress: { 
          address: 'Örnek Adres 1',
          city: 'Örnek İl',
          postalCode: '12345',
          country: 'Türkiye',
        },
        paymentMethod: 'Credit Card',
        user: userInfo.id,
      };

      try {
        const createdOrder = await createOrder(order);
        console.log('Sipariş oluşturuldu:', createdOrder);
        clearCart();
        setShowSuccess(true);

        setTimeout(() => {
          onClose();
          navigate('/orders');
        }, 2000);
      } catch (error) {
        console.error('Sipariş oluşturulamadı:', error.response?.data?.message || error.message);
        alert(`Sipariş oluşturulurken bir hata oluştu: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Ödeme Bilgileri
          </Typography>
          <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
            Toplam Tutar: {totalAmount.toLocaleString('tr-TR')} TL
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kart Numarası"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  inputProps={{ maxLength: 19 }}
                  placeholder="1234 5678 9012 3456"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kart Sahibi"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  error={!!errors.cardHolder}
                  helperText={errors.cardHolder}
                  inputProps={{ maxLength: 50 }}
                  placeholder="AD SOYAD"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Son Kullanma Ay"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  error={!!errors.expiryMonth}
                  helperText={errors.expiryMonth}
                  inputProps={{ maxLength: 2 }}
                  placeholder="MM"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Son Kullanma Yıl"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  error={!!errors.expiryYear}
                  helperText={errors.expiryYear}
                  inputProps={{ maxLength: 4 }}
                  placeholder="YYYY"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  type={showCvv ? 'text' : 'password'}
                  value={formData.cvv}
                  onChange={handleChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  inputProps={{ maxLength: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCvv(!showCvv)}
                          edge="end"
                        >
                          {showCvv ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} color="inherit">
              İptal
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#FFD700',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#FFC000'
                }
              }}
            >
              Ödemeyi Tamamla
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Siparişiniz başarıyla alınmıştır!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PaymentForm; 