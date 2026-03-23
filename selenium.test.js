const assert = require('node:assert');
const { Builder, By } = require('selenium-webdriver');
const { startServer } = require('./app');

async function runTest() {
  const server = startServer(8080, '127.0.0.1');
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://127.0.0.1:8080');
    const text = await driver.findElement(By.id('result')).getText();
    assert.strictEqual(text, 'Sum is: 5');
    console.log('Test passed');
  } finally {
    await driver.quit();
    server.close();
  }
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

/* const assert = require('node:assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { startServer } = require('./app');

async function runTest() {
  const host = '127.0.0.1';
  const port = 8080;
  const server = startServer(port, host);
  let driver;

  try {
    const options = new chrome.Options();
    //options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage');

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    await driver.get(`http://${host}:${port}`);
    const result = await driver.wait(
      until.elementLocated(By.id('result')),
      5000
    );
    const text = await result.getText();
    assert.strictEqual(text, 'Sum is: 5');
    console.log('Selenium test passed: page shows "Sum is: 5"');
  } finally {
    if (driver) {
      await driver.quit();
    }
    await new Promise((resolve) => server.close(resolve));
  }
}

runTest().catch((err) => {
  console.error('Selenium test failed:', err);
  process.exitCode = 1;
});
*/
