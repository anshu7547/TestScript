Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  return false;
});
describe('Homepage Scenario', () => {
  let menuList = [];
  let headerMenuList = [];
  let user;
  beforeEach(function () {
    cy.visit(Cypress.env('TEST_URL'));
    cy.fixture('homePageDetails.json').then((userData) => {
      user = userData;
    });
  });
  it('navbar', () => {
    let MenuListArray = [];
    cy.get("img[src='assets/images/logo-white.svg']").should('be.visible').click();
    cy.url().then((url) => {
      const actualUrl = url.replace(/\/$/, ''); // Remove trailing slash if it exists
      expect(actualUrl).to.equal(Cypress.env('TEST_URL'));
      cy.request({
        url: url,
        failOnStatusCode: false,
      })
        .its('status')
        .should('eq', 200);
    });

    cy.get('.logo-white-img').as('logoImage');
    cy.get('@logoImage').invoke('attr', 'src').as('imageSrc');
    cy.get('@imageSrc').should('include', 'assets/images/logo-white.svg');
    cy.get('button.get-started-btn').eq(0).should('contain', 'Get started');
    cy.get('a[routerlink="/open-demat-account"]').should('have.attr', 'href').and('include', '/open-demat-account');
    cy.get('.mega-menu-outer-wrap').trigger('mouseover', { force: true });
    cy.get('.menu li.nav-item')
      .each(($el, index, $list) => {
        let menu = $el.find('#dropdownConfig').text();
        menuList.push(menu);
      })
      .then(() => {
        expect(menuList).to.deep.equal(user.menuListTobe);
      });

    user.menuListTobe.forEach((menuName) => {
      const menuItem = user.menuItems.find((item) => item.name.trim() === menuName.trim());
      if (menuItem) {
        cy.get('.menu li.nav-item')
          .find('.h3')
          .each((el) => {
            const text = el.find('a').text();
            if (text.trim() === menuName.trim()) {
              cy.wrap(el).find('a').click({ force: true });
              cy.url().should('eq', menuItem.url);
              cy.log(`Tested Menu Iteam ${menuName} and working Fine`, text);
              cy.log();
              return false;
            }
          });
      } else {
        // Log an error or handle the case where the menuItem is not found
        cy.log(`Menu item not found for ${menuName}`);
      }
    });
    cy.get('.logo-white-img').eq(0).click({ force: true });
    cy.url().then((url) => {
      const actualUrl = url.replace(/\/$/, ''); // Remove trailing slash if it exists
      expect(actualUrl).to.equal(Cypress.env('TEST_URL'));
    });
    cy.get('.inner-sub-nav-menu')
      .find('.inner-sub-nav-menu-card')
      .each(($el, index, $list) => {
        let headerMenu = $el.text();
        //cy.log(headerMenu)
        headerMenuList.push(headerMenu);
        console.log(headerMenuList);
        //cy.log(JSON.stringify(headerMenuList))
      })
      .then(() => {
        expect(headerMenuList).to.deep.equal(user.headerMenuToBe);
      });

    user.headerMenuToBe.forEach((headerMenuName) => {
      const headerItem = user.headerItems.find((item) => item.name.trim() === headerMenuName.trim());
      if (headerItem) {
        cy.get('.inner-sub-nav-menu')
          .find('.inner-sub-nav-menu-card')
          .each((el) => {
            const text = el.find('a').text();
            if (text === headerItem.name) {
              cy.wrap(el).find('a').click({ force: true });
              cy.url().then((url) => {
                const actualUrl = url.replace(/\/$/, '');
                expect(actualUrl).to.equal(headerItem.url);
                cy.request({
                  url: headerItem.url,
                  failOnStatusCode: false,
                })
                  .its('status')
                  .should('eq', 200);
              });
              cy.log(`Tested headerItem ${headerMenuName} working Fine `, text);
              return false;
            }
          });
      } else {
        cy.log(`Header item not found for ${headerMenuName}`);
      }
    });
  });
});
