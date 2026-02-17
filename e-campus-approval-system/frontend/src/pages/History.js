import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/permissions/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <FaCheckCircle className="table-icon approved" />;
      case 'Rejected':
        return <FaTimesCircle className="table-icon rejected" />;
      default:
        return <FaClock className="table-icon pending" />;
    }
  };

  const getStatusBadge = (status) => {
    const className = `status-badge ${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="history-container">
          <div className="loading">Loading history...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="history-container">
        <div className="history-header">
          <h1>Permission Request History</h1>
          <p>View all your previous permission requests</p>
        </div>

        {history.length === 0 ? (
          <div className="no-data">
            <h2>No History Found</h2>
            <p>You haven't submitted any permission requests yet.</p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th>Decision Date</th>
                  <th>Rejection Reason</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="category-cell">
                        {item.category}
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {item.approvedDate 
                        ? new Date(item.approvedDate).toLocaleDateString()
                        : '-'
                      }
                    </td>
                    <td>
                      {item.status === 'Rejected' && item.rejectionReason ? (
                        <span className="rejection-text">{item.rejectionReason}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
