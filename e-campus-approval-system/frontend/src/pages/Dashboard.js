import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  FaCalendarAlt,
  FaGraduationCap,
  FaTicketAlt,
  FaFileAlt
} from 'react-icons/fa';
import './Dashboard.css';
import PermissionModal from '../components/PermissionModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const modules = [
    {
      id: 1,
      title: 'Industrial Training',
      category: 'Industrial Training',
      icon: <FaCalendarAlt />,
      description: 'Apply for industrial training, internships, or industrial visits',
      color: '#667eea'
    },
    {
      id: 2,
      title: 'Scholarship',
      category: 'Scholarship',
      icon: <FaGraduationCap />,
      description: 'Apply for various scholarship programs',
      color: '#f093fb'
    },
    {
      id: 3,
      title: 'Railway Concession',
      category: 'Railway Concession',
      icon: <FaTicketAlt />,
      description: 'Request railway concession for season ticket or educational tours',
      color: '#4facfe'
    },
    {
      id: 4,
      title: 'Original Certificates',
      category: 'Original Certificates',
      icon: <FaFileAlt />,
      description: 'Request to borrow original certificates temporarily',
      color: '#43e97b'
    },
    {
      id: 5,
      title: 'Event/Activity Permission',
      category: 'Event/Activity Permission',
      icon: <FaCalendarAlt />,
      description: 'Request permission to conduct college events or activities',
      color: '#ff6b6b'
    }
  ];

  const handleModuleClick = (category) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <p className="student-info">
            Student ID: {user?.studentId} | Department: {user?.department} | Class: {user?.class}
          </p>
          <p className="workflow-info" style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
            📋 <strong>Approval Flow:</strong> Your requests will be reviewed by your Class Teacher → Department HOD → Principal
          </p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => handleModuleClick(module.category)}
              style={{ borderTopColor: module.color }}
            >
              <div className="module-icon" style={{ color: module.color }}>
                {module.icon}
              </div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <button
                className="module-btn"
                style={{ background: module.color }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <PermissionModal
            category={selectedCategory}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
