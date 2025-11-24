import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('[Email skipped] EMAIL_USER or EMAIL_PASS is not set.');
    console.warn(`To: ${to}\nSubject: ${subject}\nText: ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
};

export default sendEmail; //
