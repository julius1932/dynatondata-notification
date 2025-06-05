const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
require('dotenv').config();
const mongoose = require('mongoose');
const HapiAuthJWT = require('hapi-auth-jwt2');
const jwt = require('jsonwebtoken');
const Pack = require('../package');
const notificationRoutes = require('./notificationRoutes');
const emailConsumer = require('../email-service/consumer');

const Wreck = require('@hapi/wreck');
const JWT_SECRET = 'rtbdynatondata';
const validateUser = async (decoded, request, h) => {
  try {
    // Extract token from Authorization header
    const auth = request.headers.authorization?.replace('Bearer ', '');
    if (!auth) {
      return { isValid: false };
    }

    // Call Auth Service
    const { payload } = await Wreck.post(
      'http://localhost:3000/auth/verify-token',
      {
        payload: { auth },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}` // Forward the token in the header
        },
      }
    );
    console.log("payload",payload.toString())

    const authResponse = JSON.parse(payload.toString());
    return {
      isValid: authResponse.isValid,
      credentials: authResponse
    };
  } catch (error) {
    console.error('Auth Service error:');
    return { isValid: false };
  }
};

const init = async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  const server = Hapi.server({ port: 3001 });

  await server.register(HapiAuthJWT);

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    validate: validateUser,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

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
        securityDefinitions: {
          jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter JWT with **Bearer** prefix, e.g., _Bearer &lt;your-token&gt;_',
          },
        },
        security: [{ jwt: [] }],
      },
    },
  ]);

  server.route(notificationRoutes);

  await server.start();
  console.log(`API Gateway running at ${server.info.uri}`);
  //emailConsumer.start().catch(console.error);
};

init();
