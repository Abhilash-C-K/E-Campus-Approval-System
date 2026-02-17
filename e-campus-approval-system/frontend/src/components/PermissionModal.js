import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTemplate, permissionTemplates } from '../utils/templates';
import api from '../utils/api';
import { FaTimes } from 'react-icons/fa';
import './PermissionModal.css';
import axios from 'axios';

const PermissionModal = ({ category, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    templateContent: getTemplate(category, user),
    reason: '',
    fromDate: '',
    toDate: '',
    assignedTeacherId: '',
    assignedTeacherName: '',
    assignedTeacherEmail: ''
  });
  const [document, setDocument] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const templateData = permissionTemplates[category];

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/auth/teachers`);
        setTeachers(response.data);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
        setError('Failed to load teachers. Please refresh the page.');
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    const selectedTeacher = teachers.find(t => t._id === teacherId);
    if (selectedTeacher) {
      setFormData({
        ...formData,
        assignedTeacherId: selectedTeacher._id,
        assignedTeacherName: selectedTeacher.name,
        assignedTeacherEmail: selectedTeacher.email
      });
    }
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('category', category);
      data.append('templateContent', formData.templateContent);
      data.append('reason', formData.reason);
      data.append('fromDate', formData.fromDate);
      data.append('toDate', formData.toDate);
      data.append('assignedTeacherId', formData.assignedTeacherId);
      data.append('assignedTeacherName', formData.assignedTeacherName);
      data.append('assignedTeacherEmail', formData.assignedTeacherEmail);

      if (document) {
        data.append('document', document);
      }

      await api.post('/api/permissions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit permission request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="success-message">
            <h3>✓ Request Submitted Successfully!</h3>
            <p>Your permission request has been submitted and is pending approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="permission-form">
            <div className="form-group">
              <label>Template Content *</label>
              <textarea
                name="templateContent"
                value={formData.templateContent}
                onChange={handleChange}
                className="form-control template-textarea"
                rows="10"
                required
              />
              <small className="form-text">
                You can edit this template to customize your request
              </small>
            </div>

            <div className="form-group">
              <label>Select Teacher *</label>
              <select
                value={formData.assignedTeacherId}
                onChange={handleTeacherChange}
                className="form-control"
                required
                disabled={loadingTeachers}
              >
                <option value="">-- Select a teacher --</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} {teacher.assignedDepartment ? `(${teacher.assignedDepartment})` : ''}
                  </option>
                ))}
              </select>
              <small className="form-text">
                {loadingTeachers ? 'Loading teachers...' : 'Choose the teacher who will review your request'}
              </small>
            </div>

            <div className="form-group">
              <label>Reason for Request *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Provide a brief reason for this request"
                required
              />
            </div>

            <div className="date-row">
              <div className="form-group">
                <label>From Date *</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>To Date *</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {templateData?.requiresDocument && (
              <div className="form-group">
                <label>
                  {templateData.documentLabel}
                  {templateData?.requiresDocument ? ' *' : ' (Optional)'}
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required={templateData?.requiresDocument}
                />
                <small className="form-text">
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </small>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PermissionModal;
