// sms-service/consumer.js
const amqp = require('amqplib');
const twilio = require('twilio');
const client = twilio('TWILIO_SID', 'TWILIO_AUTH_TOKEN');

async function start() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('smsQueue');

  ch.consume('smsQueue', async (msg) => {
    const { to, message } = JSON.parse(msg.content.toString());
    await sendSms(to, message);
    ch.ack(msg);
  });
}

async function sendSms(to, message) {
  await client.messages.create({
    body: message,
    from: '+1234567890',
    to,
  });

  console.log(`SMS sent to ${to}`);
}

start();
