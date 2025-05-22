require('dotenv').config();
const amqp = require('amqplib');

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const env = process.env.ENVIROMENT

async function start() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('emailQueue');

  ch.consume('emailQueue', async (msg) => {
    const message  = JSON.parse(msg);
    await sendEmail( message);
    ch.ack(msg);
  });
}

async function sendEmail( msg) {
 try {
        if (env !== 'development') {
            await sgMail.send(msg)
             console.log(`Email sent to ${msg.to}`);
        }
        return;
    } catch (error) {
        console.error(error);
    }
 
}
module.exports={
start
}