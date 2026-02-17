const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        required: true
    },
    submittedDate: {
        type: Date,
        required: true
    },
    completedDate: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('History', historySchema);
