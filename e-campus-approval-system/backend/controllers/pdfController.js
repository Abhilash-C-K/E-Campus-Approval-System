const PDFDocument = require('pdfkit');
const Permission = require('../models/Permission');
const Status = require('../models/Status');

// @desc    Download approved permission letter
// @route   GET /api/permissions/:id/download
// @access  Private (Student - own requests only)
exports.downloadPermissionLetter = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id)
            .populate('studentId')
            .populate('approvalHistory');

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        // Only allow student to download their own letters
        if (permission.studentId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (permission.status !== 'Approved') {
            return res.status(400).json({ message: 'Permission not yet approved' });
        }

        // Create PDF based on category
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=permission-${permission.referenceId}.pdf`);

        doc.pipe(res);

        // Generate PDF based on category
        if (permission.category === 'Industrial Training') {
            generateIndustrialTrainingPDF(doc, permission);
        } else if (permission.category === 'Scholarship') {
            generateScholarshipPDF(doc, permission);
        } else if (permission.category === 'Original Certificates') {
            generateOriginalCertificatesPDF(doc, permission);
        } else if (permission.category === 'Railway Concession') {
            generateRailwayConcessionPDF(doc, permission);
        }

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper: Add header
function addHeader(doc, title) {
    doc.fontSize(14).font('Helvetica-Bold').text('COLLEGE OF ENGINEERING, THALASSERY', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(title, { align: 'center' });
    doc.moveDown(1);
}

// Helper: Add signature with image
async function addSignature(doc, label, name, signatureUrl, xPos, yPos) {
    doc.fontSize(10).font('Helvetica');
    doc.text(`${label}: ${name}`, xPos, yPos);

    if (signatureUrl) {
        // Note: In production, download image from URL and embed
        // For now, just show placeholder
        doc.text('[Signature]', xPos, yPos + 15);
    }
}

// Generate Industrial Training PDF
function generateIndustrialTrainingPDF(doc, permission) {
    addHeader(doc, 'Request by Students towards Industrial Training /Main Project/ Internship/ Industrial visit');

    doc.fontSize(10).font('Helvetica');
    doc.text(`Class: ${permission.studentClass}`, 70);
    doc.text(`Branch: ${permission.studentDepartment}`, 350);
    doc.moveDown(1);

    // Table
    doc.rect(70, doc.y, 470, 100).stroke();
    doc.text('Name & Address of firm/organization', 75, doc.y + 10);
    doc.text('Name of participating students with Admission Number', 250, doc.y - 10);
    doc.text('Recommendation by Tutor/HOD', 420, doc.y - 10);

    doc.moveDown(6);

    doc.text(`Purpose: ${permission.reason}`, 70);
    doc.moveDown(0.5);
    doc.text(`Period from: ${new Date(permission.fromDate).toLocaleDateString()} to ${new Date(permission.toDate).toLocaleDateString()}`, 70);
    doc.moveDown(1);

    doc.text(`Date: ${new Date(permission.createdAt).toLocaleDateString()}`, 70);
    doc.text(`Signature of student: ${permission.studentName}`, 300);
    doc.moveDown(2);

    doc.text('Recommended by:', 70);
    doc.moveDown(0.5);
    doc.text(`1. Group Tutor: Name: ${permission.teacherApprovedByName || ''}`, 100);
    doc.text('Signature: _______', 400);
    doc.moveDown(1);
    doc.text(`2. HOD/ Staff in-charge: Name: ${permission.hodApprovedByName || ''}`, 100);
    doc.text('Signature: _______', 400);
    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica-Bold').text('OFFICE USE', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica');
    doc.text('Prepared by: ___________', 70);
    doc.text('Approved by: ___________', 250);
    doc.text('Sanctioned by: ___________', 400);
    doc.moveDown(1);

    doc.text(`Reference ID: ${permission.referenceId}`, 70);
    doc.text(`Approved Date: ${permission.completedAt ? new Date(permission.completedAt).toLocaleDateString() : ''}`, 300);
}

// Generate Scholarship PDF
function generateScholarshipPDF(doc, permission) {
    addHeader(doc, 'REQUEST FOR RECOMMENDATION FOR SCHOLARSHIP');

    doc.fontSize(10).font('Helvetica');
    doc.text(`Date: ${new Date(permission.createdAt).toLocaleDateString()}`, 450);
    doc.moveDown(1);

    doc.text(`Name: ${permission.studentName}`, 70);
    doc.text(`Adm. No.: ${permission.studentId}`, 350);
    doc.moveDown(0.5);
    doc.text(`Sem: ${permission.studentClass}`, 70);
    doc.text(`Branch: ${permission.studentDepartment}`, 350);
    doc.moveDown(0.5);
    doc.text('Name of Father/Mother: ___________', 70);
    doc.moveDown(0.5);
    doc.text('Name of Scholarship: ___________', 70);
    doc.moveDown(0.5);
    doc.text('Name of agency awarding scholarship: ___________', 70);
    doc.moveDown(0.5);
    doc.text('Whether specific format attached: Yes/No', 70);
    doc.moveDown(2);

    doc.text(`Date: ${new Date(permission.createdAt).toLocaleDateString()}`, 70);
    doc.text(`Signature of student`, 350);
    doc.moveDown(2);

    doc.text('Particulars verified and recommended:', 70);
    doc.moveDown(1);
    doc.text(`Group Tutor: Name: ${permission.teacherApprovedByName || ''}`, 70);
    doc.text(`HOD: Name: ${permission.hodApprovedByName || ''}`, 350);
    doc.text('Signature: _______', 70);
    doc.text('Signature: _______', 350);
    doc.moveDown(3);

    doc.fontSize(12).font('Helvetica-Bold').text('OFFICE USE', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica');
    doc.text('Remark by section:', 70);
    doc.moveDown(2);
    doc.text('Verification:', 70);
    doc.text('Approved (Principal)', 450);
    doc.moveDown(2);
    doc.text('Received', 70);
    doc.moveDown(0.5);
    doc.text(`Signature of student with date: ${permission.studentName}`, 70);
    doc.moveDown(1);

    doc.text(`Reference ID: ${permission.referenceId}`, 70);
}

// Generate Original Certificates PDF
function generateOriginalCertificatesPDF(doc, permission) {
    addHeader(doc, 'REQUEST BY STUDENTS BORROWING ORIGINAL CERTIFICATES');

    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${permission.studentName}`, 70);
    doc.moveDown(0.5);
    doc.text(`Semester & Branch: ${permission.studentClass}, ${permission.studentDepartment}`, 70);
    doc.text(`Adm. No.: ___________`, 350);
    doc.moveDown(0.5);
    doc.text('Type of Admission (Regular / Lateral entry / Spot): ___________', 70);
    doc.moveDown(1);

    doc.text('1. Required original certificate [10th / Plus Two / Diploma / Other (specify)]: ___________', 70);
    doc.moveDown(0.5);
    doc.text(`2. Purpose for which certificate seeking: ${permission.reason}`, 70);
    doc.moveDown(0.5);
    doc.text(`3. Date of return of certificate: ${new Date(permission.toDate).toLocaleDateString()}`, 70);
    doc.moveDown(2);

    doc.text(`Date: ${new Date(permission.createdAt).toLocaleDateString()}`, 70);
    doc.text(`Signature of student: ${permission.studentName}`, 350);
    doc.moveDown(2);

    doc.text('Recommended by:', 70);
    doc.moveDown(0.5);
    doc.text(`Group Tutor: Name: ${permission.teacherApprovedByName || ''}`, 70);
    doc.text(`HOD: Name: ${permission.hodApprovedByName || ''}`, 350);
    doc.text('Signature: _______', 70);
    doc.text('Signature: _______', 350);
    doc.moveDown(3);

    doc.fontSize(12).font('Helvetica-Bold').text('OFFICE USE', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica');
    doc.text('Remarks by section:', 70);
    doc.moveDown(2);
    doc.text('Sanctioned issue of required certificates:', 70);
    doc.text('Signature of Principal / Administrative officer', 350);
    doc.moveDown(1);
    doc.text('Received the following certificates:', 70);
    doc.rect(200, doc.y, 250, 80).stroke();
    doc.text('SL NO.', 210, doc.y + 10);
    doc.text('NAME OF CERTIFICATES', 280, doc.y - 10);
    doc.moveDown(6);

    doc.text(`Received the certificates: ${permission.studentName}`, 70);
    doc.moveDown(1);
    doc.text(`Reference ID: ${permission.referenceId}`, 70);
}

// Generate Railway Concession PDF
function generateRailwayConcessionPDF(doc, permission) {
    addHeader(doc, 'REQUEST BY STUDENTS FOR RAILWAY CONCESSION');

    doc.fontSize(10).font('Helvetica');

    if (permission.subcategory === 'Season Ticket') {
        doc.text('(A) For season Ticket', 70);
        doc.moveDown(1);
        doc.text(`Class: ${permission.studentClass}`, 70);
        doc.text(`Branch: ${permission.studentDepartment}`, 350);
        doc.moveDown(1);

        doc.rect(70, doc.y, 470, 60).stroke();
        doc.text('NAME', 80, doc.y + 10);
        doc.text('DOB', 200, doc.y - 10);
        doc.text('AGE', 270, doc.y - 10);
        doc.text('FROM', 330, doc.y - 10);
        doc.text('TO', 430, doc.y - 10);
        doc.text(permission.studentName, 80, doc.y + 25);
        doc.moveDown(4);
    } else {
        doc.text('(B) For Educational Tour/ Industrial training/ Other', 70);
        doc.moveDown(1);

        doc.rect(70, doc.y, 470, 60).stroke();
        doc.text('NAME & ADDRESS OF FIRM', 80, doc.y + 10);
        doc.text('FROM', 330, doc.y - 10);
        doc.text('TO', 430, doc.y - 10);
        doc.moveDown(4);
        doc.text('NB: Please attach a list of students.', 70);
    }

    doc.moveDown(1);
    doc.text(`Date: ${new Date(permission.createdAt).toLocaleDateString()}`, 70);
    doc.text(`Signature of student: ${permission.studentName}`, 350);
    doc.moveDown(2);

    doc.text('Recommended by:', 70);
    doc.moveDown(0.5);
    doc.text(`1. Group Tutor: Name: ${permission.teacherApprovedByName || ''}`, 100);
    doc.text('Signature: _______', 400);
    doc.moveDown(1);
    doc.text(`2. HOD/ Staff in-charge: Name: ${permission.hodApprovedByName || ''}`, 100);
    doc.text('Signature: _______', 400);
    doc.moveDown(3);

    doc.fontSize(12).font('Helvetica-Bold').text('OFFICE USE', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica');
    doc.text('Prepared by: ___________', 70);
    doc.text('Scrutinized by: ___________', 250);
    doc.text('Approved by: ___________', 400);
    doc.moveDown(2);
    doc.text('Received:', 70);
    doc.text(`Name & Signature of student: ${permission.studentName}`, 200);
    doc.moveDown(1);

    doc.text(`Reference ID: ${permission.referenceId}`, 70);
}
