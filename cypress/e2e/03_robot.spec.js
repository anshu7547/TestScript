Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('robot.txt', () => {
  const expectedLinks = [
    'https://blinkx.in/sitemap-main.xml',
    'https://blinkx.in/sitemap-blog.xml',
    'https://blinkx.in/sitemap-knowledgebase.xml',
    'https://blinkx.in/sitemap-webstories.xml',
    'https://blinkx.in/ipo-sitemap.xml',
    'https://blinkx.in/calculators-sitemap.xml',
    'https://blinkx.in/company-sitemap.xml'
  ];

  it('check robot.txt file', () => {
    cy.request('https://blinkx.in/robots.txt').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.headers['content-type']).to.include('text/plain');

      const responseLinks = response.body
        .split('\n')
        .filter((line) => line.startsWith('Sitemap: '))
        .map((line) => line.replace('Sitemap: ', '').trim());

      expectedLinks.forEach((link) => {
        expect(responseLinks).to.include(link);
      });

      const additionalLinks = responseLinks.filter((link) => !expectedLinks.includes(link));

      if (additionalLinks.length > 0) {
        cy.log(`Additional links found: ${JSON.stringify(additionalLinks)}`);
        cy.wrap(additionalLinks).should('be.empty');
      }
    });
  });
});
