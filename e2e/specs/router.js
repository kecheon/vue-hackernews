
module.exports = {
  'Guinea Pig Assert Title': function(browser) {
    browser
      .url('https://google.com')
      .waitForElementVisible('body', 2000)
      .end();
  }
};
