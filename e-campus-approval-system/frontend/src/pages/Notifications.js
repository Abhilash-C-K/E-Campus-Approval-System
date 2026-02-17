import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, readStatus: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications(notifications.map(notif => ({ ...notif, readStatus: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="notifications-container">
          <div className="loading">Loading notifications...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Notifications</h1>
          {notifications.some(n => !n.readStatus) && (
            <button onClick={markAllAsRead} className="mark-all-btn">
              <FaCheckCircle /> Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-data">
            <FaBell className="no-data-icon" />
            <h2>No Notifications</h2>
            <p>You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-card ${!notification.readStatus ? 'unread' : ''}`}
                onClick={() => !notification.readStatus && markAsRead(notification._id)}
              >
                <div className="notification-icon">
                  <FaBell />
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  {notification.category && (
                    <span className="notification-category">{notification.category}</span>
                  )}
                  <span className="notification-date">
                    {new Date(notification.date).toLocaleString()}
                  </span>
                </div>
                {!notification.readStatus && (
                  <div className="unread-indicator"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
