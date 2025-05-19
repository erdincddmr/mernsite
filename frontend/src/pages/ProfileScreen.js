import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Grid, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../context/UserContext';

const ProfileScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Kullanıcı kimliği bulunamadı.');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`);
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Profil yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMessage(null);
    try {
      const { data } = await axios.put(`http://localhost:5000/api/users/profile/${id}`, {
        name,
        email,
      });
      setUser(data.user);
      setUpdateMessage(data.message || 'Profil başarıyla güncellendi');
    } catch (error) {
      setUpdateMessage(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (password !== confirmPassword) {
      setPasswordMessage('Şifreler eşleşmiyor.');
      return;
    }
    try {
      const { data } = await axios.put(`http://localhost:5000/api/users/password/${id}`, {
        password,
      });
      setPasswordMessage(data.message || 'Şifre başarıyla güncellendi');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    logout();
    navigate('/login');
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;
  if (!user) return <div>Kullanıcı bulunamadı.</div>;

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        {/* Profil Bilgileri */} 
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profil Bilgileri
            </Typography>
            {updateMessage && (
              <Typography color={updateMessage.includes('başarıyla') ? 'success.main' : 'error.main'} sx={{ mb: 2 }}>
                {updateMessage}
              </Typography>
            )}
            <Box component="form" onSubmit={handleUpdateProfile}>
              <TextField
                fullWidth
                label="Ad Soyad"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="E-posta"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Güncelle
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Şifre Değiştir */} 
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Şifre Değiştir
            </Typography>
            {passwordMessage && (
              <Typography color={passwordMessage.includes('başarıyla') ? 'success.main' : 'error.main'} sx={{ mb: 2 }}>
                {passwordMessage}
              </Typography>
            )}
            <Box component="form" onSubmit={handleChangePassword}>
              <TextField
                fullWidth
                label="Yeni Şifre"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="Yeni Şifre Tekrar"
                type="password"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Şifreyi Güncelle
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Çıkış Yap Butonu */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Çıkış Yap
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileScreen; 