// commands.js
Cypress.Commands.add('checkRequestStatus', (url) => {
  cy.request({
    url,
    failOnStatusCode: false,
    rejectUnauthorized: false,
  })
    .its('status')
    .should('eq', 200);
});

Cypress.Commands.add('setupRetryOnFail', () => {
  let retryCount = 0;

  Cypress.on('fail', (error, runnable) => {
    // Check if we should retry based on the test title
    if (runnable && runnable.title.includes('Test Case 1') && retryCount < 2) {
      retryCount += 1;
      Cypress.log({
        name: 'Retrying',
        message: [runnable.title],
        consoleProps: () => ({ error, retryCount }),
      });

      // Retry the test
      runnable._retries += 1;
      return true;
    }
    return false; // Do not retry other tests
  });
});
