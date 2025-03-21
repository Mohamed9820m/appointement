const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

// Replace with your Telegram bot token
const TELEGRAM_BOT_TOKEN = '7837741793:AAHlD2m2260cFqaDNlBlDGxHM1AIF_tUbZ4';

// Initialize the Telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Handle the /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Send a message to the user
  bot.sendMessage(chatId, 'Starting the Prenot@Mi login process...');

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--single-process',
        '--no-zygote',
      ],
    });
    const page = await browser.newPage();

    console.log('Navigating to login page...');

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

    // Submit the form and wait for navigation
    try {
      await Promise.all([
        page.waitForNavigation(), // Wait for navigation
        page.click('button[type="submit"]'), // Trigger navigation
      ]);
    } catch (error) {
      console.error('Navigation error:', error);
      bot.sendMessage(chatId, 'An error occurred during navigation.');
      await browser.close();
      return;
    }

    // Check if login was successful
    const url = page.url();
    if (url.includes('/UserArea')) {
      console.log('Login successful!');
      bot.sendMessage(chatId, '✅ Login successful!');
    } else {
      console.log('Login failed.');
      bot.sendMessage(chatId, '❌ Login failed.');
    }

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, '⚠️ An error occurred while processing your request.');
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});