require('dotenv').config();
const amqp = require('amqplib');
const axios = require('axios');

async function start() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('smsQueue');

  ch.consume('smsQueue', async (msg) => {
    const { to, message } = JSON.parse(msg.content.toString());
    await sendSMS(to, message);
    ch.ack(msg);
  });
}

async function sendSMS(phone, message) {
    try {
        const response = await axios.post(
            'https://mule.apps.econet.co.zw:9038/ews-commercial-service/frontend/sms/send',
            {
                senderId: "econettest", 
                smsRecord: [
                    {
                        message: message,
                        mobiles: phone
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.SMS_API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: '*/*'
                }
            }
        );
        console.log('SMS sent successfully:', response.data);
        return;
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
        return;
    }
}

module.exports={
  sendSMS
}