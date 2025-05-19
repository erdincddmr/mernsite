import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import ListAlt from '@mui/icons-material/ListAlt';
import Person from '@mui/icons-material/Person';

const Header = () => {
  const { cartItems } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
  }, [location]);

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
      boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: isDarkMode ? '5px solid #ffffff' : '5px solid #000000'
    }}>
      <Toolbar sx={{ backgroundColor: isDarkMode ? '#000000' : '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
          <Box sx={{ height: 64, display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src={isDarkMode ? "/images/koyulogo.png" : "/images/acıklogo.png"} 
              alt="MYO Gözlük Logo" 
              style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
            />
          </Box>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textDecoration: 'none',
              color: isDarkMode ? '#ffffff' : '#000000',
              fontWeight: 'bold'
            }}
          >
            MYO Gözlük
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Button
              color="inherit"
              component={Link} 
              to="/"
              sx={{
                color: isDarkMode ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#1a1a1a' : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              Ana Sayfa
            </Button>
            <IconButton
              component={Link}
              to="/orders"
              color="inherit"
              sx={{
                color: isDarkMode ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#1a1a1a' : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <ListAlt />
            </IconButton>
            <IconButton
              color="inherit" 
              component={Link}
              to="/cart"
              sx={{
                color: isDarkMode ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#1a1a1a' : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            {user ? (
              <IconButton
                color="inherit"
                component={Link}
                to={`/profile/${user.id || user._id}`}
                sx={{
                  color: isDarkMode ? '#ffffff' : '#000000',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#1a1a1a' : 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Person />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                component={Link}
                to="/login"
                sx={{
                  color: isDarkMode ? '#ffffff' : '#000000',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#1a1a1a' : 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Person />
              </IconButton>
            )}
            <IconButton 
              onClick={toggleTheme} 
              color="inherit" 
              sx={{ 
                ml: 1,
                color: isDarkMode ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#1a1a1a' : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 