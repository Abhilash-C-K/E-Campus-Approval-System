import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: '',
    class: '',
    assignedDepartment: '',
    assignedClass: ''
  });
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!signature) {
      setError('Please upload your digital signature');
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);

      if (formData.role === 'student') {
        data.append('studentId', formData.studentId);
        data.append('department', formData.department);
        data.append('class', formData.class);
      } else if (formData.role === 'teacher') {
        data.append('assignedDepartment', formData.assignedDepartment);
        data.append('assignedClass', formData.assignedClass);
      } else if (formData.role === 'hod') {
        data.append('assignedDepartment', formData.assignedDepartment);
      }
      // Principal doesn't need additional fields

      data.append('digitalSignature', signature);

      const response = await axios.post(`${API_URL}/api/auth/register`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      login(response.data, response.data.token);

      // Redirect based on role
      if (formData.role === 'student') {
        navigate('/dashboard');
      } else if (formData.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (formData.role === 'hod') {
        navigate('/hod-dashboard');
      } else if (formData.role === 'principal') {
        navigate('/principal-dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Register to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Class Teacher</option>
              <option value="hod">HOD</option>
              <option value="principal">Principal</option>
            </select>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your student ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science Engineering</option>
                  <option value="ECE">Electronics and Communication</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="EEE">Electrical and Electronics</option>
                </select>
              </div>

              <div className="form-group">
                <label>Class/Semester</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="S4">S4</option>
                  <option value="S5">S5</option>
                  <option value="S6">S6</option>
                  <option value="S7">S7</option>
                  <option value="S8">S8</option>
                </select>
              </div>
            </>
          )}

          {formData.role === 'teacher' && (
            <>
              <div className="form-group">
                <label>Assigned Department</label>
                <select
                  name="assignedDepartment"
                  value={formData.assignedDepartment}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science Engineering</option>
                  <option value="ECE">Electronics and Communication</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="EEE">Electrical and Electronics</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Class</label>
                <select
                  name="assignedClass"
                  value={formData.assignedClass}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Class</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="S4">S4</option>
                  <option value="S5">S5</option>
                  <option value="S6">S6</option>
                  <option value="S7">S7</option>
                  <option value="S8">S8</option>
                </select>
              </div>
            </>
          )}

          {formData.role === 'hod' && (
            <div className="form-group">
              <label>Assigned Department</label>
              <select
                name="assignedDepartment"
                value={formData.assignedDepartment}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics and Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="EEE">Electrical and Electronics</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label>Digital Signature *</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
              accept="image/*"
              required
            />
            <small className="form-text">Upload your digital signature image</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="form-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
