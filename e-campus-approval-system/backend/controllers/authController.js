const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { cloudinary } = require('../middleware/upload');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Upload to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, department, class: userClass, assignedDepartment, assignedClass } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Handle digital signature upload
    let digitalSignatureUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'signatures');
      digitalSignatureUrl = result.secure_url;
    }

    // Prepare user data based on role
    const userData = {
      name,
      email,
      password,
      role,
      digitalSignature: digitalSignatureUrl
    };

    if (role === 'student') {
      userData.studentId = studentId;
      userData.department = department;
      userData.class = userClass;
    } else if (role === 'teacher') {
      userData.assignedDepartment = assignedDepartment;
      userData.assignedClass = assignedClass;
      userData.department = assignedDepartment;
      userData.class = assignedClass;
    } else if (role === 'hod') {
      userData.assignedDepartment = assignedDepartment;
      userData.department = assignedDepartment;
    }
    // Principal doesn't need department/class

    // Create user
    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        class: user.class,
        assignedDepartment: user.assignedDepartment,
        assignedClass: user.assignedClass,
        digitalSignature: user.digitalSignature,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check role
    if (user.role !== role) {
      return res.status(401).json({ message: 'Invalid credentials for this role' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update digital signature if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'signatures');
      user.digitalSignature = result.secure_url;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
      class: user.class,
      assignedDepartment: user.assignedDepartment,
      assignedClass: user.assignedClass,
      digitalSignature: user.digitalSignature,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update digital signature
// @route   PUT /api/auth/signature
// @access  Private
exports.updateSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a signature file' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'signatures');

    const user = await User.findById(req.user._id);
    user.digitalSignature = result.secure_url;
    await user.save();

    res.json({
      message: 'Signature updated successfully',
      digitalSignature: user.digitalSignature
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
