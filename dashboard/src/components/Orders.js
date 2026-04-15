import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
       const res = await axios.get(
  `${process.env.REACT_APP_API_URL}/orders`
); // adjust URL
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to="/" className="btn">Get started</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <p><strong>{order.name}</strong></p>
              <p>Qty: {order.quantity}</p>
              <p>Price: ₹{order.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;


