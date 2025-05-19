import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        width: '100%'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PhoneIcon sx={{ color: '#ffffff' }} />
              <Typography variant="body2">
                <Link href="tel:+905448375920" color="#ffffff" underline="hover" sx={{ '&:hover': { color: '#cccccc' } }}>
                  0544 837 59 20
                </Link>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <InstagramIcon sx={{ color: '#ffffff' }} />
              <Typography variant="body2">
                <Link href="https://www.instagram.com/erdincddmr/" target="_blank" color="#ffffff" underline="hover" sx={{ '&:hover': { color: '#cccccc' } }}>
                  @erdincddmr
                </Link>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: '#ffffff' }} />
              <Typography variant="body2">
                <Link href="mailto:errdincdemirr577@gmail.com" color="#ffffff" underline="hover" sx={{ '&:hover': { color: '#cccccc' } }}>
                  errdincdemirr577@gmail.com
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body1" align="center" sx={{ mt: 2, color: '#ffffff' }}>
          © 2024 MYO Gözlük. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 