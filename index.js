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
    await page.goto('https://prenotami.esteri.it/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log('Waiting for email input...');
    await page.waitForSelector('input[name="Email"]', { timeout: 60000 });
    
    console.log('Filling in email...');
    await page.type('input[name="Email"]', 'mohamedhabibmarouani8@gmail.com');
    
    console.log('Filling in password...');
    await page.type('input[name="Password"]', 'MED9820med');
    
    console.log('Submitting form...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.click('button[type="submit"]'),
    ]);
    
    console.log('Checking login status...');
    const url = page.url();
    console.log('Current URL:', url); // Log the URL for debugging
    if (url.includes('/Home/Login')) {
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