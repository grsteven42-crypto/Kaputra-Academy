export interface WelcomeEmailParams {
  parentEmail: string;
  parentName: string;
  studentName: string;
  studentId: string;
  programName: string;
  placementTestCode: string;
}

export async function sendWelcomeEmail(params: WelcomeEmailParams) {
  // Mock sending email by logging to console/terminal.
  // In a production app, you would use a service like Resend, Nodemailer, or SendGrid.
  
  const emailHtml = `
    ============================================================
    TO: ${params.parentEmail}
    SUBJECT: Welcome to Kaputra Academy
    ============================================================
    Dear ${params.parentName},

    Welcome to Kaputra Academy.

    Your enrollment has been approved.

    STUDENT INFORMATION:
    - Student Name: ${params.studentName}
    - Student ID: ${params.studentId}
    - Registered Program: ${params.programName}

    PLACEMENT TEST INFORMATION:
    - Placement Test Code: ${params.placementTestCode}

    The Placement Test Code should also be displayed clearly within the email:
    Student ID: ${params.studentId}
    Placement Test Code: ${params.placementTestCode}

    Please click the links below to continue:
    
    [Take Placement Test] -> http://localhost:3000/placement-test?studentId=${params.studentId}&code=${params.placementTestCode}
    
    [Set Password] -> http://localhost:3000/activate?studentId=${params.studentId}

    ============================================================
  `;

  console.log("SIMULATED EMAIL SENT:\n", emailHtml);
  return { success: true };
}
