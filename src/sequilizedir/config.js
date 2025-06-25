'use strict';

const dotEnv = require('dotenv');

dotEnv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
console.log(
  '🚀 ~ :18 ~ module.exports.DATABASE_URL:',
  module.exports.DATABASE_URL
);

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  logger: false,
};
