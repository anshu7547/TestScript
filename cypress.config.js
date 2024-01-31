module.exports = {
  projectId: '2ibe68',
  e2e: {
    setupNodeEvents(on, config) {

    },
    experimentalRunAllSpecs: true,
    env: {
      TEST_URL: "https://uat.blinkx.in/open-demat-account",
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: false,
    json: true,
    charts: true,
  },
  video: false,

  // retries: {
  //   runMode: 2,
  //   openMode: 1,
  // },

  // webview
  viewportWidth: 1366,
  viewportHeight: 768,

  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 300000,
  experimentalSessionAndOrigin: true,
 // "pageLoadTimeout": 30000, // Set the value to 30000 milliseconds (30 seconds) or adjust as needed

};

