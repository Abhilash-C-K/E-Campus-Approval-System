const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const {
  createPermission,
  getMyPermissions,
  getStatus,
  getHistory,
  getAllPermissions,
  getMyPendingRequests,
  approvePermission,
  rejectPermission,
  getPermissionById
} = require('../controllers/permissionController');
const { downloadPermissionLetter } = require('../controllers/pdfController');
const { protect, authority, student } = require('../middleware/auth');

// Student routes
router.post('/', protect, student, upload.single('document'), createPermission);
router.get('/my-permissions', protect, student, getMyPermissions);
router.get('/status', protect, student, getStatus);
router.get('/history', protect, student, getHistory);

// Authority routes (Teacher/HOD/Principal)
router.get('/my-pending', protect, authority, getMyPendingRequests);
router.get('/all', protect, authority, getAllPermissions);
router.put('/:id/approve', protect, authority, approvePermission);
router.put('/:id/reject', protect, authority, rejectPermission);

// Common routes
router.get('/:id', protect, getPermissionById);
router.get('/:id/download', protect, student, downloadPermissionLetter);

module.exports = router;
