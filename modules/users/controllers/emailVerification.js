
const { transport, sender } = require('../../../service/email.service');

async function sendVerificationEmail(recipientEmail, verificationCode) {
  try {
    const mailOptions = {
      from: sender,
      to: recipientEmail,
      subject: 'Speakoza Email Verification Code',
      text: `Your verification code from Speakoza is: ${verificationCode}`,
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

module.exports = { sendVerificationEmail };
