'use strict';

const dotEnv = require('dotenv');

dotEnv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  timezone: '+05:30',
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: {
    useUTC: false, // for reading from database
  },
  logger: false,
};
