let userData;
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
    cy.fixture('homePageDetails.json').then((data) => {
      userData = data; // Assign data to the top-level userData variable
      user = userData;
    });
  });
  // it('Navbar', () => {
  //   let MenuListArray = [];
  //   cy.get('.menu')
  //     .find('button[type="button"]')
  //     .each(($el, index, $list) => {
  //       const text = $el.text();
  //       // cy.log(text);
  //       // cy.log(JSON.stringify(user.menuListTobe));
  //       user.menuListTobe.forEach((menuName) => {
  //         if (text == menuName) {
  //           cy.wrap($el).click({ force: true });
  //           user.headerMenuToBe.forEach((headerMenuName) => {
  //             const headerItem = user.headerItems.find((item) => item.name.trim() === headerMenuName.trim());
  //             if (headerItem) {
  //               cy.get('.inner-sub-nav-menu')
  //                 .find('.inner-sub-nav-menu-card')
  //                 .each((el) => {
  //                   const text = el.find('a').text();
  //                   if (text === headerItem.name) {
  //                     cy.wrap(el).find('a').click({ force: true });
  //                     cy.url().then((url) => {
  //                       const actualUrl = url.replace(/\/$/, '');
  //                       expect(actualUrl).to.equal(headerItem.url);
  //                       cy.request({
  //                         url: headerItem.url,
  //                         failOnStatusCode: false,
  //                       })
  //                         .its('status')
  //                         .should('eq', 200);
  //                     });
  //                     cy.log(`Tested headerItem ${headerMenuName} working Fine `, text);
  //                     return false;
  //                   }
  //                   return false;
  //                 });
  //             } else {
  //               cy.log(`Header item not found for ${headerMenuName}`);
  //             }
  //           });
  //         } else {
  //         }
  //       });
  //     });
  // });
  // it('Home Title', () => {
  //   cy.get('h1')
  //     .invoke('text')
  //     .then((titleText) => {
  //       // expect(titleText).to.equal(userData.homePage.h1Title);
  //       cy.log(titleText);
  //     });
  //    cy.get('.left-wrap banner-info w-600').find('.input-group-wrap').invoke('text')

  // });
  it('should validate the input field within the specific container', () => {
    cy.get('h1')
      .invoke('text')
      .then((titleText) => {
        // expect(titleText).to.equal(userData.homePage.h1Title);
        cy.log(titleText);
      });
    // cy.get('.left-wrap.banner-info.w-600')
    //   .find('.input-group-wrap')
    //   .within(() => {
    //     cy.get('input[type="tel"]').should('have.attr', 'placeholder', 'Enter your mobile no');
    //     cy.get('input[type="tel"]').type(userData.validMobileNumber, { force: true });

    //     cy.get('input[type="tel"]').should('have.value', userData.validMobileNumber);

    //     cy.get('.btn.common-btn.right-icon-btn.btn-block').should('exist');

    //     cy.get('.btn.common-btn.right-icon-btn.btn-block').should('contain', 'Get started');

    //     cy.get('.btn.common-btn.right-icon-btn.btn-block').click({ force: true });

    //     cy.url().should('eq', 'https://signup.blinkx.in/diy/verify-mobile');
    //   });
    // cy.get('.left-wrap.banner-info.w-600')
    //   .find('.input-group-wrap')
    //   .each(($inputGroup, index, $inputGroupList) => {
    //     cy.log("text",$inputGroup)
    //     cy.wrap($inputGroup).within(() => {
    //       // Your assertions and interactions for each input-group-wrap
    //       cy.get('input[type="tel"]').should('have.attr', 'placeholder', 'Enter your mobile no');
    //       cy.get('input[type="tel"]').type(userData.validMobileNumber, { force: true });
    //       cy.get('input[type="tel"]').should('have.value', userData.validMobileNumber);
    //       cy.get('.btn.common-btn.right-icon-btn.btn-block').should('exist');
    //       cy.get('.btn.common-btn.right-icon-btn.btn-block').should('contain', 'Get started');
    //       cy.get('.btn.common-btn.right-icon-btn.btn-block').click({ force: true });
    //       cy.url().should('eq', 'https://signup.blinkx.in/diy/verify-mobile');
    //       cy.visit('https://blinkx.in/');
    //     });
    //   });
    cy.get('.left-wrap.banner-info.w-600')
      .find('.input-group-wrap')
      .each(($inputGroup, index, $inputGroupList) => {
        cy.log('text', $inputGroup);

        // Your assertions and interactions for each input-group-wrap
        cy.wrap($inputGroup).find('input[type="tel"]').should('have.attr', 'placeholder', 'Enter your mobile no');
        cy.wrap($inputGroup).find('input[type="tel"]').type(userData.validMobileNumber, { force: true });
        cy.wrap($inputGroup).find('input[type="tel"]').should('have.value', userData.validMobileNumber);
        cy.wrap($inputGroup).find('.btn.common-btn.right-icon-btn.btn-block').should('exist');
        cy.wrap($inputGroup).find('.btn.common-btn.right-icon-btn.btn-block').should('contain', 'Get started');
        cy.wrap($inputGroup).find('.btn.common-btn.right-icon-btn.btn-block').click({ force: true });
        cy.url().should('eq', 'https://signup.blinkx.in/diy/verify-mobile');

        // Visit the home page after processing each input-group-wrap
        cy.visit('https://blinkx.in/');
      });
  });
});

// user.menuListTobe.forEach((menuId) => {
//   const menuItem = user.menuItems.find((item) => item.id === menuId);
//   if (menuItem) {
//     cy.get('.menu li.nav-item')
//       .find('.h3')
//       .each((el) => {
//         const htmlId = el.find('a').attr('id');
//         if (htmlId && htmlId.trim() === menuId.trim()) {
//           cy.wrap(el).find('a').click({ force: true });
//           cy.url().should('eq', menuItem.url);
//           cy.log(`Tested Menu Item ${menuId} and working Fine`);
//           cy.log();
//           return false;
//         }
//       });
//   } else {
//     // Log an error or handle the case where the menuItem is not found
//     cy.log(`Menu item not found for ${menuId}`);
//   }
// });
