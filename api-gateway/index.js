const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
require('dotenv').config();
const mongoose = require('mongoose');
const Pack = require('../package');
const notificationRoutes = require('./notificationRoutes');
const emailConsumer = require('../email-service/consumer');

const init = async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  const server = Hapi.server({ port: 3000 });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Notification Service API',
          version: Pack.version,
        },
      },
    },
  ]);

  server.route(notificationRoutes);

  await server.start();
  console.log(`API Gateway running at ${server.info.uri}`);
  //emailConsumer.start().catch(console.error);
};

init();
