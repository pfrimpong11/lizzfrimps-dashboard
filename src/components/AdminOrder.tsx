import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Order interface
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
  const [orders, setOrders] = useState<Order[]>([]); // Specify the type of orders
  const [loading, setLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    // Fetch all orders from the backend
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/filter`, {
        params: { deliveryDate },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
  };

  const handleUpdateStatus = async (orderId: string) => { // Specify orderId type
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/update-status`, {
        orderId,
        status: statusUpdate,
      });
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => { // Specify orderId type
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/${orderId}`);
      fetchOrders(); // Refresh orders after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin Order Management</h1>
      <input
        type="date"
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
      />
      <button onClick={handleFilter}>Filter by Delivery Date</button>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Price</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.userId.username}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  >
                    <option value="">{order.status}</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button onClick={() => handleUpdateStatus(order.orderId)}>Update</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteOrder(order.orderId)}>Delete</button>
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
