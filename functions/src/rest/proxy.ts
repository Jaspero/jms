import * as functions from 'firebase-functions';
import {SHARED_CONFIG} from 'definitions';

const cors_proxy = require('cors-anywhere');
const server = cors_proxy.createServer({
  originWhitelist: []
});
export const proxy = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onRequest((request, response) => {
    server.emit('request', request, response);
  });
