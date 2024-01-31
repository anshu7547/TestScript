Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Lead Form Scenario', () => {
  const urlsToTest = require('../fixtures/urlsToTest.json');

  urlsToTest.forEach((urlToTest) => {
    let user;

    context(`Testing on URL: ${urlToTest}`, () => {
      before(() => {
        cy.visit(urlToTest);
        cy.fixture('footerDetails').then((userData) => {
          user = userData;
        });
      });

      it('lead form', () => {
        cy.url().then((url) => {
          const getURL = url;
          const splitSegments = getURL.split('/');
          cy.log('Split segments:', splitSegments);
          cy.log(JSON.stringify(splitSegments));

          if (
            getURL.includes('/open-demat-account') ||
            getURL.includes('/intraday-stocks') ||
            getURL.includes('stock-market-holidays') ||
            (getURL.includes('/en/knowledge-base/') && splitSegments.length === 7 && !getURL.endsWith('/en/knowledge-base/'))
          ) {
            // Lead form logic for specific URLs
            cy.get('.form-footer').should('exist');
            cy.get('.form-footer a').should('have.attr', 'href', '/assets/pdf/Final-terms-for-DIY-account-opening.pdf').and('have.attr', 'target', '_blank');
            cy.get("input[placeholder='10-Digit Mobile Number']").type('9004300384', { force: true });
            cy.get('.form-card.leadform50-kc').find('.btn.common-btn').click({ force: true });
            const expectedUrl = 'https://signup.blinkx.in/diy/verify-mobile';
            cy.get('.get-started-img-wrap').should('exist').should('be.visible');
            cy.url().should('eq', expectedUrl);
            cy.get('#txtMobile', { timeout: 0 }).should('exist');

          } else if (getURL.includes('/trading-app')) {
            cy.log('No lead form');
          } else {
            // General form logic for other URLs
            let count;
            let currentIndex = 0;
            cy.get('.input-group-wrap')
              .its('length')
              .then((c) => {
                count = c;
                cy.log(`Total elements with class '.input-group-wrap': ${count}`);
                cy.wrap('.input-group-wrap').as('inputGroupWrapElements');
              });

            cy.get('@inputGroupWrapElements')
              .should('have.length.above', 0)
              .then(() => {
                cy.get('.input-group-wrap')
                  .find('[id^="txtMobile_"]')
                  .each(($element) => {
                    // Looping through elements
                    if (currentIndex > 0) {
                      cy.visit(urlToTest);
                    }
                    const lastDigit = $element.attr('id').slice(-1);
                    const newMobileId = `txtMobile_${lastDigit}`;
                    const newMobileNumber = `#${newMobileId}`;

                    cy.get(newMobileNumber).scrollIntoView();
                    cy.get('.text-white').should('exist');

                    // Common form validations
                    cy.get('.text-white a')
                      .should('have.attr', 'href', '/assets/pdf/Final-terms-for-DIY-account-opening.pdf')
                      .and('have.class', 'text-blue zbclr')
                      .and('have.attr', 'target', '_blank')
                      .and('contain.text', 'terms & conditions');

                    cy.get(newMobileNumber).type('9004300384', { force: true });

                    cy.get(newMobileNumber).siblings('#btnSubmit').scrollIntoView().should('be.visible');
                    cy.get(newMobileNumber).siblings('#btnSubmit').click({ force: true });

                    const expectedUrl = 'https://signup.blinkx.in/diy/verify-mobile';
                    cy.get('.get-started-img-wrap').should('exist').should('be.visible');
                    cy.url().should('eq', expectedUrl);

                    cy.get('#txtMobile', { timeout: 0 }).should('exist');

                    currentIndex++;
                  })
                  .then(() => {
                    expect(currentIndex).to.equal(count);
                  });
              });
          }
        });
      });

      it('sticky footer', () => {
        cy.get('#stickey-form').scrollIntoView();

        cy.url().then((url) => {
          const getURL = url;
          const splitSegments = getURL.split('/');
          cy.log('Split segments:', splitSegments);
          cy.log(JSON.stringify(splitSegments));

          if (getURL.includes('/en/knowledge-base/') && splitSegments.length === 7 && !getURL.endsWith('/en/knowledge-base/')) {
            // Sticky footer logic for knowledge-base URL
            cy.get('#stickey-form').find('#btnSubmit').as('submitButton');
            cy.get('#stickey-form').find('#txtMobile_app-footer').as('mobileInput');
            cy.get('@mobileInput').type('9004300384', { force: true });
            cy.get('@submitButton').click({ force: true });
            const expectedUrl = 'https://signup.blinkx.in/diy/verify-mobile';
            cy.get('.get-started-img-wrap').should('exist').should('be.visible');
            cy.url().should('eq', expectedUrl);
            cy.get('#txtOTP', { timeout: 0 }).should('exist') || cy.get('#txtOTP');
          } else {
            // General sticky footer logic
            cy.get('#stickey-form').find('#txtMobile_').as('mobileInput');
            cy.get('#stickey-form').find('#btnSubmit').as('submitButton');
            cy.get('@mobileInput').type('9004300384', { force: true });
            cy.get('@submitButton').click({ force: true });
            const expectedUrl = 'https://signup.blinkx.in/diy/verify-mobile';
            cy.get('.get-started-img-wrap').should('exist').should('be.visible');
            cy.url().should('eq', expectedUrl);
            cy.get('#txtOTP', { timeout: 0 }).should('exist');
          }
        });
      });
    });
  });
});
