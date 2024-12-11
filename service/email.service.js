const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = "d09c95e4e95e25b363cd8dcc5d6c4a59"; 

const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.com", 
  name: "Mailtrap Test",
};

module.exports = { transport, sender };