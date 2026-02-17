const Permission = require('../models/Permission');
const Status = require('../models/Status');
const History = require('../models/History');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { cloudinary } = require('../middleware/upload');

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

// Generate unique reference ID
const generateReferenceId = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Get count of permissions created this month
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const count = await Permission.countDocuments({
    createdAt: { $gte: startOfMonth }
  });

  const counter = String(count + 1).padStart(4, '0');
  return `ECAS-${year}-${month}-${counter}`;
};

// @desc    Submit permission request
// @route   POST /api/permissions
// @access  Private (Student)
exports.createPermission = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      templateContent,
      reason,
      fromDate,
      toDate,
      targetDepartment,
      assignedTeacherId,
      assignedTeacherName,
      assignedTeacherEmail
    } = req.body;

    // DEBUG: Log what we received
    console.log('📥 RECEIVED DATA:', {
      assignedTeacherId,
      assignedTeacherName,
      assignedTeacherEmail,
      category,
      fromDate,
      toDate
    });

    // Get student with all details
    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate teacher selection
    if (!assignedTeacherId || !assignedTeacherName || !assignedTeacherEmail) {
      console.log('❌ VALIDATION FAILED: Teacher not selected');
      return res.status(400).json({ message: 'Please select a teacher for this request' });
    }

    // Handle document upload if provided
    let documentUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'documents');
      documentUrl = result.secure_url;
    }

    // Generate unique reference ID
    const referenceId = await generateReferenceId();

    const permission = await Permission.create({
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentDepartment: student.department,
      studentClass: student.class,
      category,
      subcategory,
      templateContent,
      reason,
      fromDate,
      toDate,
      targetDepartment,
      assignedTeacherId,
      assignedTeacherName,
      assignedTeacherEmail,
      studentSignature: student.digitalSignature,
      documentFile: documentUrl,
      referenceId,
      currentLevel: 1,
      status: 'Pending'
    });

    // Create initial status record for teacher level
    await Status.create({
      permissionId: permission._id,
      level: 1,
      role: 'teacher',
      decision: 'Pending'
    });

    // Create history record
    await History.create({
      studentId: req.user._id,
      permissionId: permission._id,
      category,
      status: 'Pending',
      submittedDate: new Date()
    });

    // DEBUG: Log created permission details
    console.log('✅ PERMISSION CREATED:');
    console.log({
      referenceId: permission.referenceId,
      studentName: permission.studentName,
      studentDepartment: permission.studentDepartment,
      studentClass: permission.studentClass,
      category: permission.category,
      currentLevel: permission.currentLevel,
      assignedTeacherId: permission.assignedTeacherId,
      assignedTeacherName: permission.assignedTeacherName,
      assignedTeacherEmail: permission.assignedTeacherEmail
    });

    res.status(201).json({
      message: 'Permission request submitted successfully',
      permission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student's permissions
// @route   GET /api/permissions/my-permissions
// @access  Private (Student)
exports.getMyPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({ studentId: req.user._id })
      .populate('approvalHistory')
      .sort({ createdAt: -1 });

    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student's latest status
// @route   GET /api/permissions/status
// @access  Private (Student)
exports.getStatus = async (req, res) => {
  try {
    const latestPermission = await Permission.findOne({ studentId: req.user._id })
      .populate('approvalHistory')
      .sort({ createdAt: -1 });

    if (!latestPermission) {
      return res.json({ message: 'No permission requests found' });
    }

    res.json(latestPermission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student's history
// @route   GET /api/permissions/history
// @access  Private (Student)
exports.getHistory = async (req, res) => {
  try {
    const permissions = await Permission.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .select('category subcategory status createdAt completedAt rejectionReason referenceId');

    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get pending requests for current authority
// @route   GET /api/permissions/my-pending
// @access  Private (Teacher/HOD/Principal)
exports.getMyPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let query = { status: 'Pending' };

    if (user.role === 'teacher') {
      // Teacher sees only requests assigned to them at level 1
      query.currentLevel = 1;
      query.assignedTeacherId = user._id;

      // DEBUG: Log teacher info and query
      console.log('🔍 TEACHER QUERY DEBUG:');
      console.log('Teacher:', {
        name: user.name,
        assignedDepartment: user.assignedDepartment,
        assignedClass: user.assignedClass
      });
      console.log('Query:', JSON.stringify(query, null, 2));
    } else if (user.role === 'hod') {
      // HOD sees requests at level 2 (their dept) or level 3 (target dept)
      query.$or = [
        { currentLevel: 2, studentDepartment: user.assignedDepartment },
        { currentLevel: 3, targetDepartment: user.assignedDepartment }
      ];
    } else if (user.role === 'principal') {
      // Principal sees all requests at final level (4 or 5)
      query.currentLevel = { $in: [4, 5] };
    }

    const permissions = await Permission.find(query)
      .populate('approvalHistory')
      .sort({ createdAt: -1 });

    // DEBUG: Log results for teacher
    if (user.role === 'teacher') {
      console.log(`📊 Found ${permissions.length} permissions`);
      if (permissions.length > 0) {
        permissions.forEach(p => {
          console.log(`  - ${p.category} from ${p.studentName} (Dept: ${p.studentDepartment}, Class: ${p.studentClass})`);
        });
      }

      // Also check ALL pending permissions to see what's available
      const allPending = await Permission.find({ status: 'Pending', currentLevel: 1 });
      console.log(`\n📋 ALL Level 1 Pending Requests (${allPending.length}):`);
      allPending.forEach(p => {
        console.log(`  - ${p.category} from ${p.studentName} (Dept: "${p.studentDepartment}", Class: "${p.studentClass}")`);
      });
    }

    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve permission
// @route   PUT /api/permissions/:id/approve
// @access  Private (Teacher/HOD/Principal)
exports.approvePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    if (permission.status !== 'Pending') {
      return res.status(400).json({ message: 'Permission already processed' });
    }

    // Get approver details
    const approver = await User.findById(req.user._id);
    const currentLevel = permission.currentLevel;
    const isCrossDepartment = !!permission.targetDepartment;

    // Verify authority can approve this request
    let canApprove = false;
    let nextLevel = currentLevel + 1;
    let isFinalized = false;

    if (approver.role === 'teacher' && currentLevel === 1) {
      canApprove = true;
      permission.teacherApprovedBy = approver._id;
      permission.teacherApprovedByName = approver.name;
      permission.teacherSignature = approver.digitalSignature;
      permission.teacherApprovedDate = new Date();
    } else if (approver.role === 'hod' && currentLevel === 2) {
      // Student's HOD
      if (permission.studentDepartment === approver.assignedDepartment) {
        canApprove = true;
        permission.hodApprovedBy = approver._id;
        permission.hodApprovedByName = approver.name;
        permission.hodSignature = approver.digitalSignature;
        permission.hodApprovedDate = new Date();

        // If cross-department, next is target HOD (level 3), else skip to principal (level 4)
        nextLevel = isCrossDepartment ? 3 : 4;
      }
    } else if (approver.role === 'hod' && currentLevel === 3 && isCrossDepartment) {
      // Target department HOD
      if (permission.targetDepartment === approver.assignedDepartment) {
        canApprove = true;
        permission.targetHodApprovedBy = approver._id;
        permission.targetHodApprovedByName = approver.name;
        permission.targetHodSignature = approver.digitalSignature;
        permission.targetHodApprovedDate = new Date();
        nextLevel = 4;
      }
    } else if (approver.role === 'principal' && (currentLevel === 4 || currentLevel === 5)) {
      canApprove = true;
      permission.principalApprovedBy = approver._id;
      permission.principalApprovedByName = approver.name;
      permission.principalSignature = approver.digitalSignature;
      permission.principalApprovedDate = new Date();
      isFinalized = true;
    }

    if (!canApprove) {
      return res.status(403).json({ message: 'You are not authorized to approve this request at this level' });
    }

    // Update status record
    const statusRecord = await Status.findOne({
      permissionId: permission._id,
      level: currentLevel
    });

    if (statusRecord) {
      statusRecord.approvedBy = approver._id;
      statusRecord.approverName = approver.name;
      statusRecord.approverSignature = approver.digitalSignature;
      statusRecord.decision = 'Approved';
      statusRecord.timestamp = new Date();
      await statusRecord.save();
    }

    if (isFinalized) {
      // Final approval by principal
      permission.status = 'Approved';
      permission.completedAt = new Date();

      // Update history
      await History.findOneAndUpdate(
        { permissionId: permission._id },
        { status: 'Approved', completedDate: new Date() }
      );

      // Notify student
      await Notification.create({
        userId: permission.studentId,
        message: `🎉 Your ${permission.category} request (${permission.referenceId}) has been FULLY APPROVED by the Principal! You can now download your permission letter.`,
        permissionId: permission._id,
        category: permission.category
      });
    } else {
      // Move to next level
      permission.currentLevel = nextLevel;

      // Create next status record
      let nextRole = '';
      if (nextLevel === 2) nextRole = 'hod';
      else if (nextLevel === 3) nextRole = 'target_hod';
      else if (nextLevel === 4) nextRole = 'principal';

      await Status.create({
        permissionId: permission._id,
        level: nextLevel,
        role: nextRole,
        decision: 'Pending'
      });

      // Notify student of progress
      let nextApproverRole = '';
      if (nextLevel === 2) nextApproverRole = 'your Department HOD';
      else if (nextLevel === 3) nextApproverRole = `${permission.targetDepartment} Department HOD`;
      else if (nextLevel === 4) nextApproverRole = 'the Principal';

      await Notification.create({
        userId: permission.studentId,
        message: `✅ Your ${permission.category} request (${permission.referenceId}) has been approved by ${approver.name} (${approver.role === 'teacher' ? 'Class Teacher' : approver.role.toUpperCase()}) and forwarded to ${nextApproverRole} for review.`,
        permissionId: permission._id,
        category: permission.category
      });
    }

    // Add status to approval history
    if (statusRecord) {
      permission.approvalHistory.push(statusRecord._id);
    }

    await permission.save();

    res.json({
      message: isFinalized ? 'Permission fully approved' : 'Permission approved and moved to next level',
      permission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject permission
// @route   PUT /api/permissions/:id/reject
// @access  Private (Teacher/HOD/Principal)
exports.rejectPermission = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    if (permission.status !== 'Pending') {
      return res.status(400).json({ message: 'Permission already processed' });
    }

    // Get rejecter details
    const rejecter = await User.findById(req.user._id);

    permission.status = 'Rejected';
    permission.rejectionReason = rejectionReason || 'Not specified';
    permission.rejectedBy = rejecter.name;
    permission.rejectedAt = new Date();
    permission.completedAt = new Date();

    // Update current level status
    const statusRecord = await Status.findOne({
      permissionId: permission._id,
      level: permission.currentLevel
    });

    if (statusRecord) {
      statusRecord.approvedBy = rejecter._id;
      statusRecord.approverName = rejecter.name;
      statusRecord.approverSignature = rejecter.digitalSignature;
      statusRecord.decision = 'Rejected';
      statusRecord.rejectionReason = rejectionReason || 'Not specified';
      statusRecord.timestamp = new Date();
      await statusRecord.save();

      permission.approvalHistory.push(statusRecord._id);
    }

    await permission.save();

    // Update history
    await History.findOneAndUpdate(
      { permissionId: permission._id },
      { status: 'Rejected', completedDate: new Date() }
    );

    // Create notification for student
    const rejecterRole = rejecter.role === 'teacher' ? 'Class Teacher' : rejecter.role === 'hod' ? 'HOD' : rejecter.role === 'principal' ? 'Principal' : rejecter.role;
    await Notification.create({
      userId: permission.studentId,
      message: `❌ Your ${permission.category} request (${permission.referenceId}) has been REJECTED by ${rejecter.name} (${rejecterRole}). Reason: ${permission.rejectionReason}`,
      permissionId: permission._id,
      category: permission.category
    });

    res.json({
      message: 'Permission rejected successfully',
      permission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get permission by ID
// @route   GET /api/permissions/:id
// @access  Private
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id)
      .populate('studentId', 'name email studentId department class')
      .populate('approvalHistory');

    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    res.json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all permissions (for admin view)
// @route   GET /api/permissions/all
// @access  Private (Any authority)
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find()
      .populate('studentId', 'name email studentId department class')
      .populate('approvalHistory')
      .sort({ createdAt: -1 });

    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
