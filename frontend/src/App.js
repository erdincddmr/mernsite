import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container, createTheme, CssBaseline, Box, Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProfileScreen from './pages/ProfileScreen';
import AdminScreen from './pages/AdminScreen';
import OrdersScreen from './pages/OrdersScreen';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        pb: 10 // Footer için alt boşluk
      }}>
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile/:id" element={<ProfileScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="/orders" element={<OrdersScreen />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

const App = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Router>
      <UserProvider>
        <ThemeProvider>
          <CartProvider>
            <OrderProvider>
              <CssBaseline />
              <AppContent />
              <Zoom in={showScrollTop}>
                <Fab
                  color="primary"
                  size="medium"
                  onClick={scrollToTop}
                  sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    backgroundColor: '#FFD700',
                    color: '#000000',
                    zIndex: 1000,
                    '&:hover': {
                      backgroundColor: '#FFC000'
                    }
                  }}
                >
                  <KeyboardArrowUpIcon />
                </Fab>
              </Zoom>
            </OrderProvider>
          </CartProvider>
        </ThemeProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
