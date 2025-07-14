import React from 'react'
import { useAppContext } from './context/AppContext'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'

function Dashboard() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Welcome to your Dashboard!</h3>
          {user && (
            <p>Logged in as: <strong>{user.email}</strong></p>
          )}
          <p>This is a protected route. Only authenticated users can see this page.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4>Quick Stats</h4>
            <p>Total Projects: 12</p>
            <p>Active Tasks: 5</p>
            <p>Completed: 7</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4>Recent Activity</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Project A updated</li>
              <li>New task assigned</li>
              <li>Meeting scheduled</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard 