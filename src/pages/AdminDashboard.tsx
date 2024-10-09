import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, ShoppingBag, Upload, Edit2, Trash2, LogOut, Menu, X } from 'lucide-react';
import AdminUpload from '../components/AdminUpload';
import AdminEditCake from '../components/AdminEditCake';
import AdminDeleteCake from '../components/AdminDeleteCake';
import AdminOrder from '../components/AdminOrder';
import AdminFeedback from '../components/AdminFeedback';

import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Upload Cake Item');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/isAuthenticated`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setAdmin(response.data.admin);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/');
      }
    };
    checkAuthentication();

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); 
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const dashboardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#ED8936',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
  };

  const sidebarStyle: React.CSSProperties = {
    width: '250px',
    backgroundColor: '#2D3748',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    bottom: isMobile ? 0 : 'auto',
    left: isMobile ? (isSidebarOpen ? '0' : '-250px') : 'auto',
    height: isMobile ? '100%' : 'calc(100vh - 64px)', // Adjust based on your header height
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
    overflowY: 'auto',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: '2rem',
    marginLeft: isMobile ? 0 : (isSidebarOpen ? '0' : 0),
    transition: 'margin-left 0.3s ease-in-out',
  };

  const tabStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: '#4A5568',
    transform: 'translateX(10px)',
  };

  const tabIconStyle: React.CSSProperties = {
    marginRight: '1rem',
  };

  const logoutButtonStyle: React.CSSProperties = {
    marginTop: 'auto',
    backgroundColor: '#E53E3E',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  };

  const menuIconStyle: React.CSSProperties = {
    cursor: 'pointer',
    display: isMobile ? 'block' : 'none',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Upload Cake Item':
        return <AdminUpload />;
      case 'View and Edit Cakes':
        return <AdminEditCake />;
      case 'Delete Cake Item':
        return <AdminDeleteCake />;
      case 'Orders':
        return <AdminOrder />;
      case 'Feedback':
        return <AdminFeedback />;
      default:
        return null;
    }
  };

  return (
    <div style={dashboardStyle} className="admin-dashboard">
      <header style={headerStyle}>
        <div className="header-content">
          {isMobile && (
            isSidebarOpen ? (
              <X size={24} onClick={toggleSidebar} style={menuIconStyle} className="menu-icon" />
            ) : (
              <Menu size={24} onClick={toggleSidebar} style={menuIconStyle} className="menu-icon" />
            )
          )}
          <h1>Lizzfrimps Cakes Empire Admin</h1>
        </div>
        <span>Welcome, Admin</span>
      </header>
      <div style={contentStyle}>
        <nav style={sidebarStyle} className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {[
            { name: 'Upload Cake Item', icon: Upload },
            { name: 'View and Edit Cakes', icon: Edit2 },
            { name: 'Delete Cake Item', icon: Trash2 },
            { name: 'Orders', icon: ShoppingBag },
            { name: 'Feedback', icon: MessageSquare },
          ].map((item) => (
            <div
              key={item.name}
              style={activeTab === item.name ? activeTabStyle : tabStyle}
              onClick={() => {
                setActiveTab(item.name);
                if (isMobile) {
                  setIsSidebarOpen(false);
                }
              }}
              className="dashboard-tab"
            >
              <item.icon size={20} style={tabIconStyle} className="dashboard-tab-icon" />
              {item.name}
            </div>
          ))}
          <button onClick={handleLogout} style={logoutButtonStyle} className="logout-button">
            <LogOut size={20} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </nav>
        <main style={mainContentStyle} className="admin-main">
          <h2>{activeTab}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;