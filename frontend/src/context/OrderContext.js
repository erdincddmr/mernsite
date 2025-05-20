import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log('Parsed user info:', user);
      console.log('User ID for API call:', user.id || user._id);

      const fetchOrders = async () => {
        try {
          setLoading(true);
          const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/orders/myorders/${user.id || user._id}`;
          console.log('Fetching orders from:', apiUrl);
          const { data } = await axios.get(apiUrl);
          console.log('Orders fetched successfully:', data);
          
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            console.error('API yanıtı bir dizi değil:', data);
            setError('Siparişler yüklenirken bir hata oluştu: Geçersiz veri formatı');
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching orders:', err);
          if (err.response) {
            console.error('Error response status:', err.response.status);
            console.error('Error response data:', err.response.data);
            setError(err.response.data.message || `Siparişler yüklenirken bir hata oluştu: ${err.response.status}`);
          } else if (err.request) {
            console.error('Error request:', err.request);
            setError('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
          } else {
            console.error('Error message:', err.message);
            setError('Siparişler yüklenirken bir hata oluştu');
          }
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      console.log('No user info found from UserContext. Not fetching orders.');
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const createOrder = async (order) => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/orders`;
      console.log('Creating order at:', apiUrl);
      const { data } = await axios.post(apiUrl, order);
      console.log('Sipariş başarıyla oluşturuldu:', data);
      return data;
    } catch (err) {
      console.error('Sipariş oluşturma hatası:', err);
      throw err;
    }
  };

  const returnOrder = async (orderId, reason) => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}/request-return`;
      console.log(`Requesting return for order ${orderId} at:`, apiUrl);
      const { data } = await axios.put(apiUrl, {
        returnReason: reason,
        returnStatus: 'Beklemede',
      });
      console.log(`Sipariş ${orderId} için iade talebi başarıyla oluşturuldu:`, data);
      
      setOrders(orders.map(order => order._id === orderId ? data : order));
      return data;
    } catch (err) {
      console.error(`Sipariş ${orderId} için iade talebi oluşturma hatası:`, err);
      throw err; 
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, error, createOrder, returnOrder }}>
      {children}
    </OrderContext.Provider>
  );
}; 