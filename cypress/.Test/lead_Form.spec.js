Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('lead Form Scenario', () => {
  let user;

  beforeEach(function () {
    cy.visit(Cypress.env('TEST_URL'));
    cy.fixture('homePageDetails.json').then((userData) => {
      user = userData;
    });
  });

  it('main lead form', () => {
    // function generateRandomMobileNumber() {
    //   const randomNumber = Math.floor(Math.random() * (11111111111 - 5000000000 + 1) + 5000000000);
    //   return randomNumber.toString().substring(0, 10);
    // }

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
            if (currentIndex > 0) {
              cy.visit(Cypress.env('TEST_URL'));
            }
            const lastDigit = $element.attr('id').slice(-1);
            const randomMobileNumber = generateRandomMobileNumber();
            const newMobileId = `txtMobile_${lastDigit}`;
            const newMobileNumber = `#${newMobileId}`;

            cy.get(newMobileNumber).scrollIntoView();

            cy.get(newMobileNumber).type(randomMobileNumber, { force: true });

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


  });

  it('Should display alert based on element presence', () => {
    cy.url().then((url) => {
      const getURL = url;
      cy.log(getURL);
      if (getURL.includes('/open-demat-account' || '/en/knowledge-base/' || '/intraday-stocks')) {
      } else {
        
      }
    });

    //   it('sticky footer', () => {
    //     cy.get('#stickey-form').scrollIntoView();

    //     cy.get('#stickey-form').find('#txtMobile_').as('mobileInput');
    //     cy.get('#stickey-form').find('#btnSubmit').as('submitButton');

    //     // Use aliases to perform actions
    //     cy.get('@mobileInput').type('9004300384', { force: true });
    //     cy.get('@submitButton').click({ force: true });

    //     const expectedUrl = 'https://signup.blinkx.in/diy/verify-mobile';
    //     cy.get('.get-started-img-wrap').should('exist').should('be.visible');
    //     cy.url().should('eq', expectedUrl);

    //     cy.get('#txtMobile', { timeout: 0 }).should('exist');
    //   });
  });
});
