Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  return false;
});

describe('Homepage Scenario', () => {
  let user;

  beforeEach(() => {
    cy.fixture('homePageDetails.json').then((userData) => {
      user = userData;
    });

    cy.visit('https://blinkx.in/en/knowledge-base/demat-account');
  });

  it('kc nav bar', () => {
    cy.get('.corosel')
      .find('div[role="tablist"] a')
      .each(($el) => {
        
        // user.KCmenuListTobe.forEach((kcTabMenu) => {
        //   cy.get('.corosel')
        //     .find('div[role="tablist"] a')
        //     .each(($el) => {
        //       const elementId = $el.attr('id');
        //       // Access the correct KcItem based on the loop iteration
        //       const matchingMenuItem = user.KcItems.find((KcItem) => KcItem.id === elementId);
        //       if (matchingMenuItem && matchingMenuItem.id === kcTabMenu) {
        //         const menuName = $el.text().trim();
        //         cy.log(menuName);
        //         cy.wrap($el).as('menuLink').click({ force: true });
        //         cy.url().should('eq', Cypress.env('TEST_URL') + matchingMenuItem.url);
        //         cy.log(`Tested Menu Item ${menuName} and working Fine`);
        //         return false;
        //       }
        //     });
        // });
      });
  });
});
