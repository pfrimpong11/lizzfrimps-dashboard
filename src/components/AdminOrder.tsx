import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Filter, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import '../styles/AdminOrder.css';

interface Order {
  orderId: string;
  userId: {
    username: string;
  };
  totalPrice: number;
  deliveryDate: string;
  status: string;
}

const AdminOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [statusUpdate, setStatusUpdate] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders`);
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/filter`, {
        params: { deliveryDate },
      });
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error("Error filtering orders:", error);
      setError("Failed to filter orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string) => {
    try {
      setLoading(true);
      await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/update-status`, {
        orderId,
        status: statusUpdate[orderId],
      });
      await fetchOrders();
      setError(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/${orderId}`);
        await fetchOrders();
        setError(null);
      } catch (error) {
        console.error("Error deleting order:", error);
        setError("Failed to delete order. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const filterContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4A5568",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#4A5568",
    color: "white",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    marginRight: "5px",
  };

  return (
    <div style={containerStyle} className="admin-order">
      <div style={headerStyle}>
        <h1>Admin Order Management</h1>
        <button onClick={fetchOrders} style={buttonStyle}>
          <RefreshCw size={16} />
          Refresh Orders
        </button>
      </div>

      <div style={filterContainerStyle}>
        <Calendar size={20} />
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleFilter} style={buttonStyle}>
          <Filter size={16} />
          Filter by Delivery Date
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Total Price</th>
              <th style={thStyle}>Delivery Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td style={tdStyle}>{order.orderId}</td>
                <td style={tdStyle}>{order.userId.username}</td>
                <td style={tdStyle}>GHS {order.totalPrice.toFixed(2)}</td>
                <td style={tdStyle}>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <select
                    value={statusUpdate[order.orderId] || order.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, [order.orderId]: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button 
                    onClick={() => handleUpdateStatus(order.orderId)} 
                    style={{ ...actionButtonStyle, backgroundColor: "#48BB78" }}
                  >
                    <CheckCircle size={16} />
                  </button>
                </td>
                <td style={tdStyle}>
                  <button 
                    onClick={() => handleDeleteOrder(order.orderId)}
                    style={{ ...actionButtonStyle, backgroundColor: "#F56565" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrder;