const amqp = require('amqplib');

async function publishMessage(queue, msg) {
  

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",msg)
  //msg = { to: "john@example.com", message: "Hello John" };
// const buffer = Buffer.from(JSON.stringify(originalMsg));
// console.log(buffer.toString());
// const decodedMsg = JSON.parse(buffer.toString());
// console.log(decodedMsg);
/* 
  const conn = await amqp.connect(process.env.CLOUDAMQP_URL||'amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
  console.log("Message sent:", msg);  */
}

module.exports={
  publishMessage
}