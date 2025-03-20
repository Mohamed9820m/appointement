const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  // const browser = await puppeteer.launch({ headless: false }); // Set headless: true for background execution

  const browser = await puppeteer.launch({
    args : [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote"
    ]
   }); 
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('https://prenotami.esteri.it/');

  // Wait for the login form to load
  await page.waitForSelector('input[name="Email"]');

  // Fill in the login form
  await page.type('input[name="Email"]', 'mohamedhabibmarouani8@gmail.com'); // Replace with your email
  await page.type('input[name="Password"]', 'MED9820med'); // Replace with your password

  // Extract hidden field values (if dynamically generated)
  const hiddenFields = await page.evaluate(() => {
    const fields = {};
    document.querySelectorAll('input[type="hidden"]').forEach((input) => {
      fields[input.name] = input.value;
    });
    return fields;
  });

  console.log('Hidden Fields:', hiddenFields);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  await page.waitForNavigation();

  // Check if login was successful
  const url = page.url();
  if (url.includes('/UserArea')) {
    console.log('Login successful!');
  } else {
    console.log('Login failed.');
  }

  // Close the browser
  await browser.close();
})();
