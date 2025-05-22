const amqp = require('amqplib');

async function publishMessage(queue, msg) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
  console.log("Message sent:", msg);
}
