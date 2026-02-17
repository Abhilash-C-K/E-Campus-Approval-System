const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'hod', 'target_hod', 'principal'],
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    approverName: {
        type: String,
        default: null
    },
    approverSignature: {
        type: String,
        default: null
    },
    decision: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    rejectionReason: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Status', statusSchema);
