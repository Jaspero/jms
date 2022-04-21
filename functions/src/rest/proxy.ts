import * as functions from 'firebase-functions';
import {SHARED_CONFIG} from 'definitions';
import {createServer} from '../utils/cors-anywhere';

const server = createServer({
  originWhitelist: []
});

/**
 * Request proxy href with query parameter 'url' containing the URL to be proxied.
 *
 * Example:
 * https://us-central1-jaspero-jms.cloudfunctions.net/cms-proxy?url=https://www.google.com
 */
export const proxy = functions
  .region(SHARED_CONFIG.cloudRegion)
  .https
  .onRequest((request, response) => {
    const url = decodeURIComponent((request.query.url as string) || '');

    (request as any).corsUrl = url.startsWith('/') ? url.slice(1) : url;
    server.emit('request', request, response);
  });
