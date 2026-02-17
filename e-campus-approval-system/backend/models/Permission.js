const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentDepartment: {
    type: String,
    required: true
  },
  studentClass: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Industrial Training', 'Scholarship', 'Original Certificates', 'Railway Concession', 'Event/Activity Permission'],
    required: true
  },
  subcategory: {
    type: String,
    default: null
  },
  templateContent: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  targetDepartment: {
    type: String,
    default: null
  },
  documentFile: {
    type: String,
    default: null
  },

  // Assigned Teacher (selected by student)
  assignedTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTeacherName: {
    type: String,
    required: true
  },
  assignedTeacherEmail: {
    type: String,
    required: true
  },

  // Multi-level approval tracking
  currentLevel: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  // Signatures for each level
  studentSignature: {
    type: String,
    default: null
  },
  teacherSignature: {
    type: String,
    default: null
  },
  hodSignature: {
    type: String,
    default: null
  },
  targetHodSignature: {
    type: String,
    default: null
  },
  principalSignature: {
    type: String,
    default: null
  },

  // Approver references
  teacherApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  teacherApprovedByName: {
    type: String,
    default: null
  },
  teacherApprovedDate: {
    type: Date,
    default: null
  },

  hodApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  hodApprovedByName: {
    type: String,
    default: null
  },
  hodApprovedDate: {
    type: Date,
    default: null
  },

  targetHodApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  targetHodApprovedByName: {
    type: String,
    default: null
  },
  targetHodApprovedDate: {
    type: Date,
    default: null
  },

  principalApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  principalApprovedByName: {
    type: String,
    default: null
  },
  principalApprovedDate: {
    type: Date,
    default: null
  },

  // Rejection info
  rejectionReason: {
    type: String,
    default: null
  },
  rejectedBy: {
    type: String,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },

  // Reference and history
  referenceId: {
    type: String,
    unique: true,
    required: true
  },
  approvalHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Permission', permissionSchema);
