export const permissionTemplates = {
  'Industrial Training': {
    template: `COLLEGE OF ENGINEERING, THALASSERY
Request by Students towards Industrial Training /Main Project/ Internship/ Industrial visit

Class: [Class]
Branch: [Department]

Name & Address of firm/organization: _______________________

Name of participating students with Admission Number: [Student Name] ([Student ID])

Purpose: [Reason]

Period from: [From Date] to [To Date]

Date: [Date]
Signature of student: [Student Name]

Recommended by:
1. Group Tutor: Name_________________________ Signature_________
2. HOD/ Staff in-charge: Name_________________________ Signature_________

OFFICE USE

Prepared by: _______________ Approved by: _______________ Sanctioned by: _______________`,
    requiresDocument: true,
    documentLabel: 'Event/Company Letter or Invitation'
  },
  'Scholarship': {
    template: `COLLEGE OF ENGINEERING, THALASSERY
REQUEST FOR RECOMMENDATION FOR SCHOLARSHIP

Name: [Student Name]                      Adm. No.: [Student ID]
Sem: [Class]                             Branch: [Department]
Name of Father/Mother: _______________________
Name of Scholarship: _______________________
Name of agency awarding scholarship: _______________________
Whether specific format attached: Yes/No

Date: [Date]                             Signature of student: [Student Name]

Particulars verified and recommended:

Group Tutor: Signature_________          HOD: Signature_________
Name: ___________________                Name: ___________________

OFFICE USE

Remark by section: _______________________

Verification:                            Approved (Principal)

Received
Signature of student with date: _______  Name of student: [Student Name]`,
    requiresDocument: true,
    documentLabel: 'Income Certificate, Mark Sheets, and Supporting Documents'
  },
  'Original Certificates': {
    template: `COLLEGE OF ENGINEERING, THALASSERY
REQUEST BY STUDENTS BORROWING ORIGINAL CERTIFICATES

Name: [Student Name]
Semester & Branch: [Class], [Department]              Adm. No.: [Student ID]
Type of Admission (Regular / Lateral entry / Spot): _______________________

1. Required original certificate [10th / Plus Two / Diploma / Other (specify)]: _______________________
2. Purpose for which certificate seeking: [Reason]
3. Date of return of certificate: [To Date]

Date: [Date]                             Signature of student: [Student Name]

Recommended by:
Group Tutor: Signature_________          HOD: Signature_________
Name: ___________________                Name: ___________________

OFFICE USE

Remarks by section: _______________________

Sanctioned issue of required certificates:
Signature of Principal / Administrative officer: _______________________

Received the following certificates:
[Certificate List]

Received the certificates: [Student Name]`,
    requiresDocument: false
  },
  'Railway Concession': {
    template: `COLLEGE OF ENGINEERING, THALASSERY
REQUEST BY STUDENTS FOR RAILWAY CONCESSION

(A) For season Ticket
Class: [Class]                           Branch: [Department]

NAME: [Student Name]
DOB: _______  AGE: _______  FROM: _______  TO: _______

(B) For Educational Tour/ Industrial training/ Other
NAME & ADDRESS OF FIRM: _______________________
FROM: _______  TO: _______

NB: Please attach a list of students.

Date: [Date]                             Signature of student: [Student Name]

Recommended by:
1. Group Tutor: Name_________________________ Signature_________
2. HOD/ Staff in-charge: Name_________________________ Signature_________

OFFICE USE

Prepared by: _______________ Scrutinized by: _______________ Approved by: _______________

Received: _______
Name & Signature of student: [Student Name]`,
    requiresDocument: false,
    hasSubcategory: true,
    subcategories: ['Season Ticket', 'Educational Tour/Industrial Training']
  },
  'Event/Activity Permission': {
    template: `[Student Name]
[Class], [Department]
College of Engineering Thalassery
[Date]

To
The Principal
College of Engineering Thalassery

Subject: Request for Permission to Conduct [Event/Activity]

Respected Sir,

I kindly request your permission to conduct [Event/Activity Name] on [From Date] at [Venue/Time].

This program is organized under the initiative of [Organization Name] with the objective of [Reason]. The activity aims to [Brief Benefit to Students or College].

We assure you that the program will be conducted in a disciplined manner without causing any disruption to regular academic activities. We sincerely request your approval and support for the same.

Thank you for your consideration.

Yours sincerely,
[Student Name]
[Class], [Department]
College of Engineering Thalassery

Recommended by:
Group Tutor: Signature_________          HOD: Signature_________
Name: ___________________                Name: ___________________

OFFICE USE
Approved by Principal: _______________   Date: _______________`,
    requiresDocument: true,
    documentLabel: 'Event Proposal or Supporting Documents'
  }
};

export const getTemplate = (category, studentData = {}) => {
  const templateData = permissionTemplates[category];
  if (!templateData) return '';

  let template = templateData.template;

  // Replace placeholders if student data is provided
  if (studentData.name) {
    template = template.replace(/\[Student Name\]/g, studentData.name);
  }
  if (studentData.studentId) {
    template = template.replace(/\[Student ID\]/g, studentData.studentId);
  }
  if (studentData.department) {
    template = template.replace(/\[Department\]/g, studentData.department);
  }
  if (studentData.class) {
    template = template.replace(/\[Class\]/g, studentData.class);
  }

  const today = new Date().toLocaleDateString();
  template = template.replace(/\[Date\]/g, today);

  return template;
};
