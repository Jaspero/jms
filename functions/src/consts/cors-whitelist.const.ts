import * as cors from 'cors';
import {SHARED_CONFIG} from 'definitions';

export const CORS = cors({
  origin: [
    `https://${SHARED_CONFIG.projectId}.web.app`,
    ...process.env.NODE_ENV !== 'production' ? ['http://localhost:4200'] : []
  ],
  optionsSuccessStatus: 200,
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
});
