const nodemailer = require('nodemailer');
const fs = require('fs');
const configData = require('./emailConfig.json');
const emailConfig = configData;
const { createWriteStream } = require('fs');
const { createGzip } = require('zlib');
const path = require('path');

function createZipFile(inputFolder, outputFile) {
  const output = createWriteStream(outputFile);
  const archive = createGzip();

  archive.pipe(output);

  const files = fs.readdirSync(inputFolder);

  files.forEach((file) => {
    const filePath = path.join(inputFolder, file);
    if (fs.statSync(filePath).isFile()) {
      archive.write(fs.readFileSync(filePath));
    }
  });
  archive.end();
}
const transporter = nodemailer.createTransport({
  service: emailConfig.serviceProvider,
  auth: {
    user: emailConfig.senderEmailAddresser,
    pass: emailConfig.senderEmailPassword,
  },
});

function getTodaysDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

function generateHTMLTable(filePath) {
  try {
    const rawData = fs.readFileSync(filePath);
    const jsonData = JSON.parse(rawData);
    if (jsonData.stats) {
      const stats = jsonData.stats;
      const suites = stats.suites || 0;
      const tests = stats.tests || 0;
      const passes = stats.passes || 0;
      const pending = stats.pending || 0;
      const failures = stats.failures || 0;
      const testsRegistered = stats.testsRegistered || 0;
      const passPercent = stats.passPercent || 0;
      const pendingPercent = stats.pendingPercent || 0;
      const skipped = stats.skipped || 0;
      const htmlTable = `
                <table style="width: 60%; border-collapse: collapse; margin: 10px auto; border: 1px solid #ddd;">
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Suites</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${suites}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Tests</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${tests}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Passes</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${passes}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Pending</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${pending}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Failures</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${failures}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Tests Registered</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${testsRegistered}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Pass Percent</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${passPercent}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Pending Percent</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${pendingPercent}</td>
                    </tr>
                    <tr>
                        <td style="background-color: #f2f2f2; color: #333; padding: 10px; border: 1px solid #ddd;">Skipped</td>
                        <td style="background-color: #e6f7ff; padding: 10px; border: 1px solid #ddd;">${skipped}</td>
                    </tr>
                </table>`;
      return htmlTable;
    } else {
      console.error('Error: "stats" property not found in the JSON file.');
      return null;
    }
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error.message);
    return null;
  }
}
const filePath = 'cypress\\reports\\merged-report.json';
const htmlTable = generateHTMLTable(filePath);

function sendEmail() {
  const screenshotDir = 'cypress/screenshots';
  const zipFilePath = 'cypress/screenshots/screenshots.zip';
  const mergedReportPath = 'cypress/reports/merged-report.html';

  if (fs.existsSync(screenshotDir) && fs.existsSync(zipFilePath) && fs.existsSync(mergedReportPath)) {
    createZipFile(screenshotDir, zipFilePath);
    const mailOptions = {
      from: emailConfig.senderEmailAddresser,
      to: emailConfig.recipientEmailAddresser,
      subject: emailConfig.subject + `${getTodaysDate()}`,
      html: `
    <div style="font-family: 'Arial', sans-serif; color: #333; text-align: center;">
    <h1 style="color: #2ecc71;">Automated Test Script Report</h1>
    <p style="font-size: 14px; text-align: left;">I hope this email finds you well. Attached herewith is the automated test script report for the Blinkx as of ${getTodaysDate()}.</p>
    <p style="font-size: 14px; text-align: left;">The report includes a comprehensive overview of the test execution, identified issues, and overall test coverage.</p>
    <div style="font-family: 'Arial', sans-serif; color: #333; margin: 20px auto; text-align: center;">
        <h2 style="color: #3498db; text-align: center;">Test Summary</h2>
      ${htmlTable}
      <p style="font-size: 16px; text-align: left;">For detailed information, please refer to the attached merged HTML report.</p>
        <p style="font-size: 16px; color: #b5b3b3; text-align: left;">Best Regards,<br><span style="font-size: 16px; color: #000; text-align: left;" >Tejas Patil</span></p>
    </div>
</div>
    `,
      attachments: [
        {
          filename: 'merged-report.html',
          content: fs.readFileSync('cypress/reports/merged-report.html', 'utf-8'),
        },
        {
          filename: 'screenshots.zip',
          path: zipFilePath,
        },
      ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } else {
    const mailOptions = {
      from: emailConfig.senderEmailAddresser,
      to: emailConfig.recipientEmailAddresser,
      subject:  `Automated Test Execution Report for Blinkx ${getTodaysDate()}`,
      html: `
    <div style="font-family: 'Arial', sans-serif; color: #333; text-align: center;">
    <h1 style="color: #2ecc71;">Automated Test Script Report</h1>
    <p style="font-size: 14px; text-align: left;">I hope this email finds you well. Attached herewith is the automated test script report for the Blinkx as of ${getTodaysDate()}.</p>
    <p style="font-size: 14px; text-align: left;">The report includes a comprehensive overview of the test execution, identified issues, and overall test coverage.</p>
    <div style="font-family: 'Arial', sans-serif; color: #333; margin: 20px auto; text-align: center;">
        <h2 style="color: #3498db; text-align: center;">Test Summary</h2>
      ${htmlTable}
      <p style="font-size: 16px; text-align: left;">For detailed information, please refer to the attached merged HTML report.</p>
        <p style="font-size: 16px; color: #b5b3b3; text-align: left;">Best Regards,<br><span style="font-size: 16px; color: #000; text-align: left;" >Tejas Patil</span></p>
    </div>
</div>
    `,
      attachments: [
        {
          filename: 'merged-report.html',
          content: fs.readFileSync('cypress/reports/merged-report.html', 'utf-8'),
        },
      ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
}

sendEmail();
