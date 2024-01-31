// Function to parse XML string to Document
function parseXML(xmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
}

describe('XML Sitemap', () => {
  let unexpectedUrls = [];
  it('check XML sitemap content', () => {
    const expectedUrls = [
      'https://blinkx.in/sitemap-main.xml',
      'https://blinkx.in/sitemap-blog.xml',
      'https://blinkx.in/sitemap-knowledgebase.xml',
      'https://blinkx.in/sitemap-webstories.xml',
      'https://blinkx.in/ipo-sitemap.xml',
      'https://blinkx.in/calculators-sitemap.xml',
      'https://blinkx.in/company-sitemap.xml',
      'https://blinkx.in/sitemap-indices.xml',
    ];

    cy.request('https://blinkx.in/sitemap-index.xml').then((response) => {
      expect(response.status).to.equal(200);

      const xml = parseXML(response.body);

      expectedUrls.forEach((url) => {
        const urlElements = Array.from(xml.querySelectorAll('url loc')).map((element) => element.textContent.trim());

        expect(urlElements).to.include(url, `URL: ${url} should be present in the XML`);

        expect(response.body.includes(url), `URL: ${url} should be present in the response`).to.be.true;
      });


      Array.from(xml.querySelectorAll('url loc')).forEach((element) => {
        const url = element.textContent.trim();
        if (!expectedUrls.includes(url)) {
          unexpectedUrls.push(url);
        }
      });
      cy.log(JSON.stringify(unexpectedUrls));
      cy.wrap(unexpectedUrls).should('be.empty');
    });
  });
});
