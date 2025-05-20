import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

const OrdersScreen = () => {
  const { orders, loading, error, returnOrder } = useOrder();
  const navigate = useNavigate();
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const returnReasons = [
    'Ürün hasarlı geldi',
    'Ürün beklentilerimi karşılamadı',
    'Yanlış ürün gönderildi',
    'Ürün kusurlu',
    'Diğer'
  ];

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch (e) {
      console.error("Geçersiz tarih formatı:", dateString);
      return dateString;
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setOpenReturnDialog(true);
  };

  const handleReturnSubmit = async () => {
    if (!selectedOrder) return; // Seçili sipariş yoksa bir şey yapma

    const reason = returnReason === 'Diğer' ? otherReason : returnReason;

    try {
      await returnOrder(selectedOrder._id, reason); // Güncellenmiş returnOrder fonksiyonunu çağır
      alert('İade talebiniz başarıyla oluşturuldu.');
      setOpenReturnDialog(false);
      setReturnReason('');
      setOtherReason('');
      setSelectedOrder(null);
    } catch (error) {
      alert(`İade talebi oluşturulurken bir hata oluştu: ${error.message}`);
      console.error('İade talebi gönderme hatası:', error);
    }
  };

  const getStatusColor = (status, returnStatus) => {
    if (returnStatus === 'Beklemede') return 'warning';
    if (status === 'İade Talebi') return 'error';
    if (status === 'Hazırlanıyor') return 'warning';
    if (status === 'Shipped') return 'info';
    if (status === 'Delivered') return 'success';
    return 'success';
  };

  if (loading) {
    return (
      <Container>
        <Typography>Siparişler yükleniyor...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">Hata: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Siparişlerim
      </Typography>

      {orders && Array.isArray(orders) && orders.length === 0 ? (
        <Typography>Henüz siparişiniz bulunmamaktadır.</Typography>
      ) : (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
          Siparişiniz gözükmüyorsa sayfayı yenileyiniz.
        </Typography>
      )}

      {orders && Array.isArray(orders) && orders.length > 0 ? (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sipariş ID: {order._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Sipariş Tarihi: {formatDate(order.createdAt)}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={order.isDelivered ? 'Teslim Edildi' : order.isPaid ? 'Ödendi' : 'Ödenmedi'}
                      color={order.isDelivered ? 'success' : order.isPaid ? 'primary' : 'error'}
                      sx={{ mr: 1 }}
                    />
                    {order.returnStatus && (
                       <Chip 
                         label={`İade: ${order.returnStatus}`}
                         color={getStatusColor('' , order.returnStatus)}
                       />
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>Ürünler:</Typography>
                  {order.orderItems.map((item) => (
                    <Box key={item._id} sx={{ mb: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1">
                            {item.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Adet: {item.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                              {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleProductClick(item.product)}
                              sx={{
                                borderColor: '#FFD700',
                                color: '#FFD700',
                                '&:hover': {
                                  borderColor: '#FFC000',
                                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                                }
                              }}
                            >
                              Ürüne Git
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" align="right">
                    Toplam: {order.totalPrice.toLocaleString('tr-TR')} TL
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleReturnClick(order)}
                    sx={{ mt: 2 }}
                  >
                    İade Talebi Oluştur
                  </Button>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        null
      )}

      <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)}>
        <DialogTitle>İade Talebi Oluştur</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Sipariş ID: {selectedOrder?._id}</Typography>
          <TextField
            select
            label="İade Nedeni"
            fullWidth
            margin="normal"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          >
            {returnReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
          {returnReason === 'Diğer' && (
            <TextField
              label="Diğer Neden (Belirtiniz)"
              fullWidth
              margin="normal"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnDialog(false)} color="secondary">İptal</Button>
          <Button onClick={handleReturnSubmit} color="primary">Gönder</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default OrdersScreen; 