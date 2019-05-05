const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
const welcomeMail = (name, email) => {
  sendGrid.send({
    to: email,
    from: process.env.DOMAIN_EMAIL,
    subject: `${name}, welcome to Task manager!`,
    text: `${name}, Task manager can help you organise everyday tasks`
  });
};

const cancelMail = (name, email) => {
  sendGrid.send({
    to: email,
    from: process.env.DOMAIN_EMAIL,
    subject: `${name}, it is hard to say goodbye`,
    text: `${name}, we will miss you.`
  });
};

module.exports = {
  welcomeMail,
  cancelMail
};