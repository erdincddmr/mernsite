import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    console.log('localStorage userInfo:', userInfo);

    if (userInfo) {
      const user = JSON.parse(userInfo);
      console.log('Parsed user info:', user);
      console.log('User ID for API call:', user.id || user._id);

      const fetchOrders = async () => {
        try {
          setLoading(true);
          const apiUrl = `/api/orders/myorders/${user.id || user._id}`;
          console.log('Fetching orders from:', apiUrl);
          const { data } = await axios.get(apiUrl);
          console.log('Orders fetched successfully:', data);
          setOrders(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching orders:', err.response?.data?.message || err.message);
          setError(err.response?.data?.message || 'Siparişler yüklenirken hata oluştu');
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      console.log('No userInfo found in localStorage.');
      setOrders([]);
      setLoading(false);
    }
  }, []);

  const createOrder = async (order) => {
    try {
      const { data } = await axios.post('/api/orders', order);
      console.log('Sipariş başarıyla oluşturuldu:', data);
      return data;
    } catch (err) {
      console.error('Sipariş oluşturma hatası:', err);
      throw err;
    }
  };

  const returnOrder = async (orderId, reason) => {
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/request-return`, {
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