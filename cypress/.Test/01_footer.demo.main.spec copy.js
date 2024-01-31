Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('footerDetails.json', () => {
  const urlsToTest = require('../fixtures/urlsToTest.json');
  urlsToTest.forEach((urlsToTest) => {
    let user;
    let menuList = [];
    let subMenuDetails = [];
    let errorList = [];
    let errorListStocks = [];
    let topStocks = [];
    let topIndices = [];
    let errorTopIndices = [];
    let missingElementsList = [];
    let dataFormSite = [];
    let newShowData = [];

    context(`Testing on URL: ${urlsToTest}`, () => {
      beforeEach(() => {
        cy.visit(urlsToTest);
        cy.fixture('footerDetails').then((userData) => {
          user = userData;
        });
      });

      it('footer test cases', () => {
        //scroll to footer
        cy.get('.common-footer-new').scrollIntoView();
        //footer main menu and links
        cy.get('.footer-accordion.position-relative.accordion').should('be.visible').should('exist').should('not.be.empty');
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

        cy.get('.datalayerFooter').each(($el, index) => {
          const id = $el.attr('id');
          const text = $el.text().trim();
          const href = $el.attr('href');
          dataFormSite.push({ id, text, href });

          const correspondingItem = user.accordionData.find((item) => item.id === id && item.text === text && item.href === href);

          if (correspondingItem) {
            cy.then(() => {
              expect(correspondingItem.id).to.equal(id);
              expect(correspondingItem.text).to.equal(text);
              expect(correspondingItem.href).to.equal(href);
            });
            cy.checkRequestStatus(correspondingItem.href);
            subMenuDetails.push({ id, text, href });
          } else {
            const jsonItemExists = user.accordionData.some((item) => item.id === id && item.text === text && item.href === href);

            // Log an error and add to errorList
            cy.log(`**[error]** No corresponding item found for ID: ${id}, Text: ${text}, Href: ${href}`);
            errorList.push({ id, text, href });
          }
        });
        cy.log(JSON.stringify(dataFormSite));

        cy.then(() => {
          console.log('SubMenuDetails:', JSON.stringify(subMenuDetails));
          console.log('errorList:', JSON.stringify(errorList));

          // Continue with other assertions or actions as needed
        });

        dataFormSite.forEach((item) => {
          user.accordionData.forEach((userItem) => {
            if (item.id == userItem.id && item.text == userItem.text && item.href == userItem.href) {
              newShowData.push(userItem);
              console.log('newShowData:', JSON.stringify(newShowData));
            } else {
              missingElementsList.push(userItem);

              console.log('missingElementsList:', JSON.stringify(missingElementsList));
            }
          });
        });

        //stockDIR test cases
        cy.get('.bx-stock--directory---title').should('be.visible').should('exist').should('have.text', 'Stocks directory:');
        cy.get('.bx-stock--directory---filters').should('be.visible').should('exist').should('not.be.empty');
        cy.get('.bx-stock--directory---filters')
          .find('li')
          .each(($el) => {
            const StockDirName = $el.text().trim();
            const stockHref = $el.find('a').attr('href');
            cy.checkRequestStatus(stockHref);
            //cy.log('----------------',StockDirName,stockHref);
          });

        // Get started CTA
        cy.get('.get-started-btn[href="/open-demat-account"]').last().invoke('text').should('exist').should('not.be.empty').should('contain', 'Get started');
        cy.get('.container.container-1400.position-relative a')
          .invoke('attr', 'href')
          .then((href) => {
            cy.checkRequestStatus(href);
          });

        //download-app
        cy.get('.download-app')
          .find('a')
          .each(($el) => {
            cy.wrap($el).should('exist').should('be.visible').should('not.be.empty');
            const appURL = $el.attr('href');
            cy.checkRequestStatus(appURL);
          });

        //social media
        // cy.get('.footer-info-wrap li a').each((link) => {
        //   cy.wrap(link).should('be.visible').should('not.be.empty').should('exist').should('have.attr', 'rel', 'nofollow');
        //   const socialLink = link.attr('href');
        //   cy.request({
        //     url: socialLink,
        //     failOnStatusCode: false,
        //     rejectUnauthorized: false,
        //   })
        //     .its('status')
        //     .then((status) => {
        //       if (status === 404) {
        //         cy.log(`Warning: Social link ${socialLink} returned a 404 status.`);
        //         console.log(`%cWarning: Social link ${socialLink} returned a %c404 status.`, 'color: red; font-weight: bold;');
        //       } else {
        //         cy.log(`Social link ${socialLink} is accessible.`);
        //         console.log(`Social link ${socialLink} is %accessible.`, 'color: green;');
        //       }
        //     });
        // });

        // disclaimer and reg PDF
        cy.get('.p-14.xs-mt0 a').each(($el) => {
          cy.wrap($el).should('exist').should('not.be.empty');
          const assetPDF = $el.attr('href');
          cy.checkRequestStatus(assetPDF);
        });

        //top stocks
        cy.get('.mostPopularTitle').scrollIntoView({});
        cy.get('.mostPopularTitle').should('be.visible').should('exist').should('not.be.empty').should('have.text', 'Most Popular on BlinkX');

        cy.get('.topBold').first().should('be.visible').should('exist').invoke('text').should('include', 'Top Stocks:');

        cy.get('.topBold')
          .first()
          .find('.anchor')
          .each(($el) => {
            const originalText = $el.text().trim();
            const modifiedText = originalText.replace(' |', '').trim();
            const href = $el.attr('href');
            const topStock = user.topStocksList.find((item) => item.href === href && item.text === modifiedText);
            if (topStock) {
              cy.then(() => {
                expect(topStock.text).to.equal(modifiedText);
                expect(topStock.href).to.equal(href);
              });
              cy.checkRequestStatus(topStock.href);
              topStocks.push({ text: modifiedText, href });
            } else {
              cy.log(' **[error]** ' + `No corresponding item found for Text: ${modifiedText} and Href: ${href}`);
              errorListStocks.push({ text: modifiedText, href });
            }
          })
          .then(() => {
            cy.log('Top stock which not available on page :', JSON.stringify(errorListStocks));
            console.log('topStockErrorList:', JSON.stringify(errorListStocks));
            expect(topStocks).to.deep.equal(user.topStocksList);
            cy.wrap(errorListStocks).should('be.empty');
            // console.log('Top stock found on page:', JSON.stringify(topStocks));
            // cy.log(`Size of user.topStocks array: ${topStocks.length}`);
            cy.wrap(user.topStocksList).should('have.length', topStocks.length);
          });

        cy.get('.topBold.indicesText')
          .find('a')
          .each(($el) => {
            const originalText = $el.text().trim();
            const modifiedText = originalText.replace(' |', '').trim();
            const href = $el.attr('href');
            const topIndice = user.topIndicesList.find((item) => item.href === href && item.text === modifiedText);
            if (topIndice) {
              cy.then(() => {
                expect(topIndice.text).to.equal(modifiedText);
                expect(topIndice.href).to.equal(href);
              });
              cy.checkRequestStatus(topIndice.href);
              topIndices.push({ text: modifiedText, href });
            } else {
              cy.log(' **[error]** ' + `No corresponding item found for Text: ${modifiedText} and Href: ${href}`);
              errorTopIndices.push({ text: modifiedText, href });
            }
          })
          .then(() => {
            cy.log('Top stock which not available on page :', JSON.stringify(errorTopIndices));
            console.log('ErroListTopIndices:', JSON.stringify(errorTopIndices));
            console.log('Top indices found on page:', JSON.stringify(topIndices));

            expect(topIndices).to.deep.equal(user.topIndicesList);
            cy.wrap(errorTopIndices).should('be.empty');
            // cy.log(`Size of user.topStocks array: ${topIndices.length}`);
            cy.wrap(user.topIndicesList).should('have.length', topIndices.length);
          });
      });
    });
  });
});
