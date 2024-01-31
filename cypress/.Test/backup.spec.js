Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('footerDetails.json', () => {
  const urlsToTest = require('../../fixtures/urlsToTest.json');
  urlsToTest.forEach((urlsToTest) => {
    let user;
    let subMenuDetails = [];
    let errorList = [];
    let menuList = [];
    context(`Testing on URL: ${urlsToTest}`, () => {
      beforeEach(() => {
        cy.visit(urlsToTest);
        cy.fixture('footerDetails').then((userData) => {
          user = userData;
        });
      });

      it('footer test cases', () => {
        // scroll to footer
        cy.get('.common-footer-new').scrollIntoView();
        //footer main menu and links
        cy.get('.footer-accordion.position-relative.accordion')
          .find('.accordion-item')
          .each(($el, index, $list) => {
            let menu = $el.find('button').text().trim();
            if (menu !== '') {
              menuList.push(menu);
            }
          })
          .then(() => {
            if (user.footerNameAndId) {
              const expectedNames = user.footerNameAndId.map((item) => item.name);
              expect(menuList).to.deep.equal(expectedNames);
              cy.log(JSON.stringify(menuList));
            }
          });

        // footer submenu links
        // cy.get('.datalayerFooter')
        //   .each(($el, index) => {
        //     const id = $el.attr('id');
        //     const text = $el.text().trim();
        //     const href = $el.attr('href');
        //     const correspondingItem = user.accordionData.find((item) => item.id === id && item.text === text);
        //     cy.then(() => {
        //       // Here, you are using `item` instead of `correspondingItem`
        //       expect(item.id).to.equal(id);
        //       expect(item.text).to.equal(text);
        //       expect(item.href).to.equal(href);
        //     });

        //     // if (correspondingItem) {
        //     //   cy.then(() => {
        //     //     expect(item.id).to.equal(id);
        //     //     expect(item.text).to.equal(text);
        //     //     expect(item.href).to.equal(href);
        //     //   });
        //     //   cy.checkRequestStatus(correspondingItem.href);
        //     //   subMenuDetails.push({ id, text, href });
        //     // }
        //     // else {
        //     //   cy.log(`No corresponding item found for ID: ${id} and Text: ${text}`);
        //     //   expect(item.id).to.equal(id);
        //     //   expect(item.text).to.equal(text);
        //     //   expect(item.href).to.equal(href);
        //     //   cy.checkRequestStatus(correspondingItem.href);
        //     //   errorList.push({ id, text, href });
        //     // }
        //   })
        //   .then(() => {
        //     console.log('SubMenuDetails:', JSON.stringify(subMenuDetails));
        //     console.log('errorList:', JSON.stringify(errorList));
        //     expect(user.accordionData).to.deep.equal(subMenuDetails);
        //   });
        cy.get('.datalayerFooter')
          .each(($el, index) => {
            const id = $el.attr('id');
            const text = $el.text().trim();
            const href = $el.attr('href');

            // Use forEach to iterate over each item in user.accordionData
            user.accordionData.forEach((item) => {
              if (item.id === id && item.text === text) {
                cy.then(() => {
                  expect(item.id).to.equal(id);
                  expect(item.text).to.equal(text);
                  expect(item.href).to.equal(href);
                });
                cy.checkRequestStatus(item.href);
                subMenuDetails.push({ id, text, href });
              }
            });

            // Handle the case when no corresponding item is found
            
            if (!user.accordionData.some((item) => item.id === id && item.text === text)) {
            //   expect(item.id).to.equal(id);
            //   expect(item.text).to.equal(text);
            //   expect(item.href).to.equal(href);
              cy.log(`No corresponding item found for ID: ${id} and Text: ${text}`);
              errorList.push({ id, text, href });
              subMenuDetails.push({ id, text, href });
            }
          })
          .then(() => {
            console.log('SubMenuDetails:', JSON.stringify(subMenuDetails));
            console.log('errorList:', JSON.stringify(errorList));
            expect(subMenuDetails).to.deep.equal(user.accordionData);
          });

        //stockDIR test cases
        cy.get('.bx-stock--directory---title').should('be.visible').should('have.text', 'Stocks directory:');
        cy.get('.bx-stock--directory---filters')
          .find('li')
          .each(($el) => {
            const StockDirName = $el.text().trim();
            const stockHref = $el.find('a').attr('href');
            cy.checkRequestStatus(stockHref);
            //cy.log('----------------',StockDirName,stockHref);
          });

        // Get started CTA
        cy.get('.color-white.btn.common-btn.right-icon-btn.btn-block.get-started-btn.cust-get-started-btn').invoke('text').should('contain', 'Get started');
        cy.get('.container.container-1400.position-relative a')
          .invoke('attr', 'href')
          .then((href) => {
            cy.checkRequestStatus(href);
          });

        //download-app
        cy.get('.download-app')
          .find('a')
          .each((el) => {
            const appURL = el.attr('href');
            cy.checkRequestStatus(appURL);
          });

        //social media
        cy.get('.footer-info-wrap li a').each((link) => {
          cy.wrap(link).should('have.attr', 'rel', 'nofollow');
          const socialLinks = link.attr('href');
          cy.checkRequestStatus(socialLinks);
        });

        // disclaimer and reg PDF
        cy.get('.p-14.xs-mt0 a').each((el) => {
          const assetPDF = el.attr('href');
          cy.checkRequestStatus(assetPDF);
        });
      });
    });
  });
});
