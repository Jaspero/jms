import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';

const cors_proxy = require('cors-anywhere');
const server = cors_proxy.createServer({
  originWhitelist: [],
  // requireHeader: ['origin', 'x-requested-with'],
  // removeHeaders: ['Content-Disposition']
});
export const proxy = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onRequest((request, response) => {
    server.emit('request', request, response);
  });
