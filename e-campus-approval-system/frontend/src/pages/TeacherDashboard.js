import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const TeacherDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (user?.role !== 'teacher') {
            navigate('/login');
            return;
        }
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/permissions/my-pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleApprove = async (requestId) => {
        if (!window.confirm('Are you sure you want to approve this request?')) return;

        setLoading(true);
        try {
            const request = pendingRequests.find(r => r._id === requestId);
            await axios.put(`${API_URL}/api/permissions/${requestId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const deptName = request?.studentDepartment || 'the department';
            setMessage({ type: 'success', text: `Request approved and forwarded to ${deptName} HOD for further review!` });
            fetchPendingRequests();
            setSelectedRequest(null);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Approval failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (requestId) => {
        if (!rejectionReason.trim()) {
            setMessage({ type: 'error', text: 'Please provide a rejection reason' });
            return;
        }

        if (!window.confirm('Are you sure you want to reject this request?')) return;

        setLoading(true);
        try {
            await axios.put(`${API_URL}/api/permissions/${requestId}/reject`,
                { rejectionReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Request rejected!' });
            fetchPendingRequests();
            setSelectedRequest(null);
            setRejectionReason('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Rejection failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Teacher Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                    <p className="sub-info">Department: {user?.assignedDepartment}</p>
                </div>
                <button
                    onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                    <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
                </div>
            )}

            <div className="dashboard-content">
                <h2>Pending Requests ({pendingRequests.length})</h2>

                {pendingRequests.length === 0 ? (
                    <div className="no-data">
                        <p>No pending requests at the moment.</p>
                    </div>
                ) : (
                    <div className="requests-grid">
                        {pendingRequests.map((request) => (
                            <div key={request._id} className="request-card">
                                <div className="request-header">
                                    <h3>{request.category}</h3>
                                    <span className="badge pending">Pending Teacher Approval</span>
                                </div>

                                <div className="request-details">
                                    <p><strong>Student:</strong> {request.studentName}</p>
                                    <p><strong>Department:</strong> {request.studentDepartment}</p>
                                    <p><strong>Class:</strong> {request.studentClass}</p>
                                    <p><strong>From:</strong> {new Date(request.fromDate).toLocaleDateString()}</p>
                                    <p><strong>To:</strong> {new Date(request.toDate).toLocaleDateString()}</p>
                                    <p><strong>Reason:</strong> {request.reason}</p>
                                </div>

                                <div className="request-actions">
                                    <button
                                        className="btn-view"
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedRequest.category} Request</h2>
                            <button onClick={() => setSelectedRequest(null)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>Student Information</h3>
                                <p><strong>Name:</strong> {selectedRequest.studentName}</p>
                                <p><strong>Email:</strong> {selectedRequest.studentEmail}</p>
                                <p><strong>Department:</strong> {selectedRequest.studentDepartment}</p>
                                <p><strong>Class:</strong> {selectedRequest.studentClass}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Request Details</h3>
                                <p><strong>Category:</strong> {selectedRequest.category}</p>
                                {selectedRequest.subcategory && (
                                    <p><strong>Type:</strong> {selectedRequest.subcategory}</p>
                                )}
                                <p><strong>From Date:</strong> {new Date(selectedRequest.fromDate).toLocaleDateString()}</p>
                                <p><strong>To Date:</strong> {new Date(selectedRequest.toDate).toLocaleDateString()}</p>
                                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                                {selectedRequest.targetDepartment && (
                                    <p><strong>Target Department:</strong> {selectedRequest.targetDepartment}</p>
                                )}
                            </div>

                            <div className="detail-section">
                                <h3>Template Content</h3>
                                <pre className="template-preview">{selectedRequest.templateContent}</pre>
                            </div>

                            {selectedRequest.documentFile && (
                                <div className="detail-section">
                                    <h3>Uploaded Document</h3>
                                    <a href={selectedRequest.documentFile} target="_blank" rel="noopener noreferrer" className="btn-link">
                                        View Document
                                    </a>
                                </div>
                            )}

                            <div className="detail-section">
                                <h3>Action</h3>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Rejection reason (required if rejecting)"
                                    rows="3"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-approve"
                                onClick={() => handleApprove(selectedRequest._id)}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : `Approve & Forward to ${selectedRequest.studentDepartment} HOD`}
                            </button>
                            <button
                                className="btn-reject"
                                onClick={() => handleReject(selectedRequest._id)}
                                disabled={loading}
                            >
                                Reject
                            </button>
                            <button className="btn-secondary" onClick={() => setSelectedRequest(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
