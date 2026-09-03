import serverless from 'serverless-http';
import { createApp } from '../../server/app.js';
import { connectDatabase } from '../../server/db.js';

let handlerPromise;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      try {
        await connectDatabase();
      } catch (err) {
        console.warn('Database connection warning in Netlify function:', err.message);
      }
      return serverless(createApp());
    })();
  }
  return handlerPromise;
}

export async function handler(event, context) {
  const resolvedHandler = await getHandler();
  return resolvedHandler(event, context);
}
