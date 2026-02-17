const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const {
  register,
  login,
  getMe,
  updateSignature
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', upload.single('digitalSignature'), register);
router.post('/login', upload.single('digitalSignature'), login);
router.get('/me', protect, getMe);
router.put('/signature', protect, upload.single('digitalSignature'), updateSignature);

// @route   GET /api/auth/teachers
// @desc    Get all teachers (for student dropdown)
// @access  Public
router.get('/teachers', async (req, res) => {
  try {
    const User = require('../models/User');
    const teachers = await User.find({ role: 'teacher' })
      .select('_id name email assignedDepartment assignedClass')
      .sort({ name: 1 });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
