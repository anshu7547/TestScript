Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('footerDetails.json', () => {
  let user;
  let subMenuDetails = [];
  let menuList = [];

  beforeEach(() => {
    cy.visit(Cypress.env('TEST_URL'));
    cy.fixture('footerDetails').then((userData) => {
      user = userData;
    });
  });

  it('footer', () => {
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
        }
      });

    // footer links
    cy.get('.datalayerFooter')
      .each(($el, index) => {
        // Get id, text, and href from the current element
        const id = $el.attr('id');
        const text = $el.text().trim();
        const href = $el.attr('href');

        // Find the corresponding item from user.accordionData
        const correspondingItem = user.accordionData.find((item) => item.id === id && item.text === text);

        if (correspondingItem) {
          // Continue with your assertions
          cy.then(() => {
            expect(correspondingItem.id).to.equal(id);
            expect(correspondingItem.text).to.equal(text);
            expect(correspondingItem.href).to.equal(href);
          });

          // Make the request
          // cy.request({
          //   url: correspondingItem.href,
          //   failOnStatusCode: false,
          // })
          //   .its('status')
          //   .should('eq', 200);
          cy.checkRequestStatus(correspondingItem.href);
          // Push details to subMenuDetails array
          subMenuDetails.push({ id, text, href });
        } else {
          cy.log(`No corresponding item found for ID: ${id} and Text: ${text}`);
        }
      })
      .then(() => {
        // Log the entire object after the loop
        console.log('SubMenuDetails:', JSON.stringify(subMenuDetails));
        expect(user.accordionData).to.deep.equal(subMenuDetails);
      });

    //stockDIR
    cy.get('.bx-stock--directory---title').should('be.visible').should('have.text', 'Stocks directory:');
    cy.get('.bx-stock--directory---filters')
      .find('li')
      .each(($el) => {
        const StockDirName = $el.text().trim();
        const stockHref = $el.find('a').attr('href');
        // Make the request
        // cy.request({
        //   url: stockHref,
        //   failOnStatusCode: false,
        // })
        //   .its('status')
        //   .should('eq', 200);
        cy.checkRequestStatus(stockHref);
        //cy.log('----------------',StockDirName,stockHref);
      });

    // Get started
    cy.get('.color-white.btn.common-btn.right-icon-btn.btn-block.get-started-btn.cust-get-started-btn').invoke('text').should('contain', 'Get started');

    cy.get('.container.container-1400.position-relative a')
      .invoke('attr', 'href')
      .then((href) => {
        // Make a request and assert the status
        // cy.request({
        //   url: href,
        //   failOnStatusCode: false,
        // })
        //   .its('status')
        //   .should('eq', 200);
        cy.checkRequestStatus(href);
      });

    //download-app
    cy.get('.download-app')
      .find('a')
      .each((el) => {
        const appURL = el.attr('href');
        // Make the request
        // cy.request({
        //   url: appURL,
        //   failOnStatusCode: false,
        // })
        //   .its('status')
        //   .should('eq', 200);
        cy.checkRequestStatus(appURL);
      });

    //social media
    cy.get('.footer-info-wrap li a').each((link) => {
      cy.wrap(link).should('have.attr', 'rel', 'nofollow');

      const socialLinks = link.attr('href');

      // cy.request({
      //   url: socialLinks,
      //   failOnStatusCode: false,
      // })
      //   .its('status')
      //   .should('eq', 200);
      cy.checkRequestStatus(socialLinks);
    });

    cy.get('.p-14.xs-mt0 a').each((el) => {
      const assetPDF = el.attr('href');
      // cy.request({
      //   url: assetPDF,
      //   failOnStatusCode: false,
      // })
      //   .its('status')
      //   .should('eq', 200);
      cy.checkRequestStatus(assetPDF);
    });
  });
});
