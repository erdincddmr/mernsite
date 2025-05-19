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
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`/api/orders/myorders/${user.id || user._id}`);
          setOrders(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Siparişler yüklenirken hata oluştu');
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
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