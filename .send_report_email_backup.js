const nodemailer = require('nodemailer');
const fs = require('fs');
const configData = require('./config.json');
const cheerio = require('cheerio');
const emailConfig = configData;

// Email configuration
const transporter = nodemailer.createTransport({
  service: emailConfig.serviceProvider,
  auth: {
    user: emailConfig.senderEmailAddresser,
    pass: emailConfig.senderEmailPassword,
  },
});

// Function to get today's date
function getTodaysDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

// Function to extract test summary from the merged HTML report
function extractTestSummary() {
  try {
    const filePath = 'cypress/reports/merged-report.html';
    const mergedReportContent = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(mergedReportContent);
    console.log(`Attempting to read file: ${filePath}`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read the file content
    const totalTests = $('li[title="Tests"]').text().trim();
    console.log('Total Tests:', totalTests);

    const passedTests = $('.quick-summary--passes---3IjYH button').text().trim();
    console.log('Passed Tests:', passedTests);

    const failedTests = $('.quick-summary--failures---14s29 button').text().trim();
    console.log('Failed Tests:', failedTests);

    const skippedTests = $('.quick-summary--skipped---tyOc4 button').text().trim();
    console.log('Skipped Tests:', skippedTests);

    // Create and return the summary table HTML
    return `
    <table style="width: 60%; border-collapse: collapse; margin: 10px auto; border: 1px solid #ddd;">
              <tr>
                  <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Total Tests Executed</td>
                  <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${totalTests}</td>
              </tr>
              <tr>
                  <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Tests Passed</td>
                  <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${totalTests - failedTests - skippedTests}</td>
              </tr>
              <tr>
                  <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Tests Failed</td>
                  <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${failedTests}</td>
              </tr>
              <tr>
                  <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Tests Skipped</td>
                  <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${skippedTests}</td>
              </tr>
          </table>`;
  } catch (error) {
    console.error('Error in extractTestSummary:', error.message);
    throw error;
  }
}

// // Example usage
// try {
//   const summaryHTML = extractTestSummary();
//   console.log('Test Summary HTML:', summaryHTML);
// } catch (error) {
//   console.error('Error in script:', error.message);
// }

// Function to send the email with the HTML report attached and test summary in the body
// function sendEmail() {
//   const mailOptions = {
//     from: emailConfig.senderEmailAddresser,
//     to: emailConfig.recipientEmailAddresser,
//     subject: emailConfig.subject + `${getTodaysDate()}`,
//     html: `
//     <div style="font-family: 'Arial', sans-serif; color: #333; text-align: center;">
//     <h1 style="color: #2ecc71;">Automated Test Script Report</h1>
//     <p style="font-size: 14px; text-align: left;">I hope this email finds you well. Attached herewith is the automated test script report for the Blinkx as of ${getTodaysDate()}.</p>
//     <p style="font-size: 14px; text-align: left;">The report includes a comprehensive overview of the test execution, identified issues, and overall test coverage.</p>
//     <div style="font-family: 'Arial', sans-serif; color: #333; margin: 20px auto; text-align: center;">
//         <h2 style="color: #3498db; text-align: center;">Test Summary</h2>
//       ${extractTestSummary()}
//       <p style="font-size: 16px; text-align: left;">For detailed information, please refer to the attached merged HTML report.</p>
//         <p style="font-size: 16px; color: #b5b3b3; text-align: left;">Best Regards,<br><span style="font-size: 16px; color: #000; text-align: left;" >Tejas Patil</span></p>
//     </div>
// </div>
//     `,
//     attachments: [
//       {
//         filename: 'merged-report.html',
//         content: fs.readFileSync('cypress/reports/merged-report.html', 'utf-8'),
//       },
//     ],
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// }

// Call the function to send the email
// sendEmail();
console.log(extractTestSummary());
