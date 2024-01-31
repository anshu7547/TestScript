Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
describe('footerDetails.json', () => {
  let user;
  let menuList = [];
  beforeEach(function () {
    cy.visit(Cypress.env('TEST_URL'));
    cy.fixture('footerDetails').then((userData) => {
      user = userData;
    });
  });
  it('footer', () => {
    cy.get('.common-footer-new').scrollIntoView();
    cy.get('.footer-accordion.position-relative.accordion')
      .find('.accordion-item')
      .each(($el, index, $list) => {
        let menu = $el.find('button').text().trim();
        if (menu !== '') {
          menuList.push(menu);
          cy.wrap($el)
            .invoke('attr', 'id')
            .then((accordionItemId) => {
              const fixtureItem = user.footerNameAndId.find((item) => item.name === menu);
              expect(accordionItemId).to.equal(fixtureItem.id);
              expect(menu).to.equal(fixtureItem.name);
            });
        }
      })
      .then(() => {
        if (user.footerNameAndId) {
          const expectedNames = user.footerNameAndId.map((item) => item.name);
          expect(menuList).to.deep.equal(expectedNames);
        }
      });
    cy.get('.footer-accordion.position-relative.accordion')
      .find('.accordion-item')
      .each(($el, index, $list) => {
        let menu = $el.find('button').text().trim();
        //#ngb-accordion-item-0-collapse

        for (let i = 0; i < menuList.length; i++) {
          cy.wrap($el)
            .invoke('attr', 'id')
            .then((accordionItemId1) => {
              const fixtureItem1 = user.footerNameAndId.find((item) => item.name === menu);
              cy.log(user.footerNameAndId.id);
              cy.pause();
              // cy.log('------------->', accordionItemId1);
              // cy.log('------------->', fixtureItem1.id);
              // cy.log('------------->', fixtureItem1.name);

              if (fixtureItem1.id === user.footerNameAndId.id && fixtureItem1.name === user.footerNameAndId.name) {
                cy.get('.accordion-body')
                  .find('ul')
                  .each(($el, index, $list) => {
                    let subMenuText = $el.text().trim();
                    cy.log(subMenuText);

                    cy.pause();
                  })
                  .then(() => {
                    let key = fixtureItem1.name;
                    let value = subMenuText;
                    // Store key-value pair in subMenuDetails object
                    subMenuDetails[key] = value;
                    cy.log('SubMenuDetails:', subMenuDetails);
                  });
              } else {
              }
            });

          //   cy.get('.accordion-body').find('ul').each(($el, index, $list) => {
          //     let subMenuText = $el.text().trim();
          //     cy.log(subMenuText);
          //     cy.pause();

          //   });
        }
      });
  });
});
