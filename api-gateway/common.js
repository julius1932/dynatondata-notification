const Boom = require('@hapi/boom');

const onError = (error, context = 'Internal Server Error') => {
  console.error(`[Error] ${context}:`, error);

  // Customize Boom error as needed
  return Boom.internal(context);
};

module.exports = onError;
