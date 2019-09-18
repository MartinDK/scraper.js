// Build An App To Track Amazon's Prices 
// https://www.youtube.com/watch?v=H5ObmDUjKV4

// Scraping using the node package - nightmare
// Sending emails using the node package - "@sendgrid/mail"
// Environment variables using the node package - "dotenv"
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nightmare = require('nightmare')();

// The block below will reads the arguments when running the code using node.
// e.g node scraper.js url minPrice
const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];
// ------

checkPrice();

async function checkPrice() {

    try {
        const priceString = await nightmare.goto("https://www.amazon.com.au/dp/B07H61C9KP/")
            .wait("#priceblock_ourprice")
            .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
            .end();
        const priceNumber = parseFloat(priceString.replace('$', ''));
        if (priceNumber < 200) {
            // The below line will send an email using SendGrid Email Service
            //await sendEmail('Price Is Low', `The price on ${url} has dropped below ${minPrice}`); 
            console.log('It is cheap $' + priceNumber);
        } else {
            console.log('It is expensive $' + priceNumber);
        };
    } catch (e) {
        // The below line will send an email using SendGrid Email Service
        // await sendEmail('Amazon Price Checker Error', e.message);
        console.log('Amazon Price Checker Error', e.message);

        throw e;
    };

}

function sendEmail(subject, body) {
    const email = {
        to: 'email@address.com',
        from: 'amazon-price-checker@example.com',
        subject: subject,
        text: body,
        html: body
    };

    return sgMail.send(email);
}