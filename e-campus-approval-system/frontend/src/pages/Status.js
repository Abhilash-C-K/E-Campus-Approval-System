import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCheckCircle, FaTimesCircle, FaClock, FaDownload } from 'react-icons/fa';
import './Status.css';

const Status = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvalHistory, setApprovalHistory] = useState([]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/api/permissions/status');
      setStatus(response.data);

      // Fetch approval history if permission exists
      if (response.data?._id) {
        const historyResponse = await api.get(`/api/permissions/${response.data._id}/approval-history`);
        setApprovalHistory(historyResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (permissionId) => {
    try {
      window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/permissions/${permissionId}/download`, '_blank');
    } catch (error) {
      console.error('Error downloading letter:', error);
    }
  };

  const getStatusIcon = (decision) => {
    switch (decision) {
      case 'Approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'Rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusClass = (decision) => {
    switch (decision) {
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="status-container">
          <div className="loading">Loading status...</div>
        </div>
      </>
    );
  }

  if (!status || status.message) {
    return (
      <>
        <Navbar />
        <div className="status-container">
          <div className="no-data">
            <h2>No Permission Requests Found</h2>
            <p>You haven't submitted any permission requests yet.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="status-container">
        <div className="status-header">
          <h1>Latest Permission Status</h1>
          {status.status === 'Approved' && (
            <button className="btn-download" onClick={() => handleDownload(status._id)}>
              <FaDownload /> Download Permission Letter
            </button>
          )}
        </div>

        <div className="status-card">
          <div className="status-badge-container">
            {getStatusIcon(status.status)}
            <h2 className={getStatusClass(status.status)}>{status.status}</h2>
          </div>

          <div className="status-details">
            <div className="detail-row">
              <span className="detail-label">Reference ID:</span>
              <span className="detail-value">{status.referenceId}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{status.category}</span>
            </div>

            {status.subcategory && (
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{status.subcategory}</span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">Reason:</span>
              <span className="detail-value">{status.reason}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Period:</span>
              <span className="detail-value">
                {new Date(status.fromDate).toLocaleDateString()} - {new Date(status.toDate).toLocaleDateString()}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Submitted On:</span>
              <span className="detail-value">
                {new Date(status.createdAt).toLocaleString()}
              </span>
            </div>

            {status.status === 'Rejected' && status.rejectionReason && (
              <div className="detail-row rejection-reason">
                <span className="detail-label">Rejection Reason:</span>
                <span className="detail-value rejection-text">
                  {status.rejectionReason}
                </span>
              </div>
            )}
          </div>

          {/* Approval Timeline */}
          {approvalHistory && approvalHistory.length > 0 && (
            <div className="approval-timeline">
              <h3>Approval Timeline</h3>
              <div className="timeline">
                {approvalHistory.map((item, index) => (
                  <div key={index} className={`timeline-item ${item.decision.toLowerCase()}`}>
                    <div className="timeline-marker">
                      {getStatusIcon(item.decision)}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{item.role === 'target_hod' ? 'Target HOD' : item.role.toUpperCase()}</strong>
                        <span className={`badge ${item.decision.toLowerCase()}`}>{item.decision}</span>
                      </div>
                      {item.approverName && (
                        <p><strong>By:</strong> {item.approverName}</p>
                      )}
                      {item.timestamp && (
                        <p><small>{new Date(item.timestamp).toLocaleString()}</small></p>
                      )}
                      {item.approverSignature && (
                        <img src={item.approverSignature} alt={`${item.role} signature`} className="timeline-signature" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status.templateContent && (
            <div className="template-section">
              <h3>Submitted Template</h3>
              <div className="template-content">
                {status.templateContent}
              </div>
            </div>
          )}

          {status.documentFile && (
            <div className="document-section">
              <h3>Attached Document</h3>
              <a
                href={status.documentFile}
                target="_blank"
                rel="noopener noreferrer"
                className="document-link"
              >
                View Document
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Status;
