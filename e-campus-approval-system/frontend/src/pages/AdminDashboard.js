import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/api/permissions/all');
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (actionType === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setProcessing(true);

    try {
      if (actionType === 'approve') {
        await api.put(`/api/permissions/${selectedPermission._id}/approve`);
      } else {
        await api.put(`/api/permissions/${selectedPermission._id}/reject`, {
          rejectionReason
        });
      }

      alert(`Permission ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowModal(false);
      setSelectedPermission(null);
      setRejectionReason('');
      fetchPermissions();
    } catch (error) {
      alert('Error processing request: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const openActionModal = (permission, type) => {
    setSelectedPermission(permission);
    setActionType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPermission(null);
    setRejectionReason('');
    setActionType(null);
  };

  const getStatusBadge = (status) => {
    const className = `status-badge ${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-container">
          <div className="loading">Loading permissions...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Permission Requests Management</h1>
          <p>Review and manage student permission requests</p>
        </div>

        {permissions.length === 0 ? (
          <div className="no-data">
            <h2>No Permission Requests</h2>
            <p>There are no permission requests at the moment.</p>
          </div>
        ) : (
          <div className="permissions-grid">
            {permissions.map((permission) => (
              <div key={permission._id} className="permission-card">
                <div className="card-header">
                  <h3>{permission.category}</h3>
                  {getStatusBadge(permission.status)}
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Student:</span>
                    <span className="value">{permission.studentName}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{permission.studentEmail}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Reason:</span>
                    <span className="value">{permission.reason}</span>
                  </div>

                  <div className="info-row">
                    <span className="label">Period:</span>
                    <span className="value">
                      {new Date(permission.fromDate).toLocaleDateString()} - {new Date(permission.toDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="label">Submitted:</span>
                    <span className="value">
                      {new Date(permission.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {permission.documentFile && (
                    <div className="info-row">
                      <span className="label">Document:</span>
                      <a 
                        href={permission.documentFile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>

                {permission.status === 'Pending' ? (
                  <div className="card-actions">
                    <button
                      onClick={() => openActionModal(permission, 'approve')}
                      className="btn-approve"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => openActionModal(permission, 'reject')}
                      className="btn-reject"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="card-footer">
                    <span className="decision-info">
                      {permission.status === 'Approved' ? 'Approved' : 'Rejected'} by {permission.approvedByName} on {new Date(permission.approvedDate).toLocaleDateString()}
                    </span>
                    {permission.status === 'Rejected' && permission.rejectionReason && (
                      <span className="rejection-reason">
                        Reason: {permission.rejectionReason}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && selectedPermission && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{actionType === 'approve' ? 'Approve' : 'Reject'} Permission</h2>
              </div>

              <div className="modal-body">
                <div className="permission-details">
                  <h3>{selectedPermission.category}</h3>
                  <p><strong>Student:</strong> {selectedPermission.studentName}</p>
                  <p><strong>Reason:</strong> {selectedPermission.reason}</p>
                  
                  <div className="template-preview">
                    <h4>Template Content:</h4>
                    <pre>{selectedPermission.templateContent}</pre>
                  </div>
                </div>

                {actionType === 'reject' && (
                  <div className="form-group">
                    <label>Rejection Reason *</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="form-control"
                      rows="4"
                      placeholder="Please provide a reason for rejection"
                      required
                    />
                  </div>
                )}

                <p className="confirmation-text">
                  Are you sure you want to {actionType} this permission request?
                </p>
              </div>

              <div className="modal-footer">
                <button onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className={actionType === 'approve' ? 'btn-approve' : 'btn-reject'}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
