const  config = require('../../config')

const port = process.env.PORT || config.dev.port

module.exports = {
  'paginates items correctly': function(browser) {
  let originalItemListText;
  browser
    .url(`localhost:${port}`)
    .waitForElementVisible('.news-item',  15000)
    .getText('.item-list', function(result) {
      originalItemListText = result.value
    })
    .click('.item-list-nav a:nth-of-type(2 )')
    .waitForElementNotVisible('.progress',  15000)
    .perform(() => {
      browser.expect.element('.item-list').text.to.not.equal(originalItemListText, 'More detailed message what is wrong.')
    })
    .getText('.item-list', function(result) {
      originalItemListText = result.value
    })
    .click('.item-list-nav a')
    .waitForElementNotVisible('.progress',  15000)
    .perform(() => {
      browser.expect.element('.item-list').text.to.not.equal(originalItemListText)
    })
  },

'changes list by clicking through nav': function(browser) {
  let originalItemListText;
  browser
    .url(`localhost:${port}`)
    .waitForElementVisible('.news-item',  15000)
    .getText('.item-list', function(result) {
      originalItemListText = result.value
    })
    .click('.inner a:nth-of-type(2)')
    .waitForElementNotVisible('.progress',  15000)
    .perform(() => {
      browser.expect.element('.item-list').text.to.not.equal(originalItemListText)
    })
    .getText('.item-list', function(result) {
      originalItemListText = result.value
    })
    .click('.inner a:nth-of-type(4)')
    .waitForElementNotVisible('.progress',  15000)
    .perform(() => {
      browser.expect.element('.item-list').text.to.not.equal(originalItemListText)
    })
  },

'takes user to the item page': function(browser) {
  browser
    .url(`localhost:${port}`)
    .waitForElementVisible('body', 2000)
    .waitForElementVisible('.news-item',  10000)
    .click('.comments-link')
    .assert.urlContains(`/item`)
    .waitForElementVisible('.item-view',  10000)
    .end();
},

'clicking on a user redirects to  the user page': function(browser) {
  browser
    .url(`localhost:${port}`)
    .waitForElementVisible('body', 2000)
    .waitForElementVisible('.news-item',  10000)
    .click('.by a')
    .assert.urlContains(`/user`)
    .waitForElementVisible('.user-view',  10000)
    .end();
}
};
