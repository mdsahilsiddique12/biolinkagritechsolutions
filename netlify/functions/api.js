import serverless from 'serverless-http';
import { createApp } from '../../server/app.js';
import { assertCriticalConfig } from '../../server/config.js';
import { connectDatabase } from '../../server/db.js';
import { getMailer } from '../../server/services/emailService.js';

let handlerPromise;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      try {
        assertCriticalConfig();
      } catch (err) {
        console.warn('Config warning in Netlify function:', err.message);
      }
      try {
        await connectDatabase();
      } catch (err) {
        console.warn('Database connect warning in Netlify function:', err.message);
      }
      try {
        await getMailer();
      } catch (err) {
        console.warn('Mailer init warning in Netlify function:', err.message);
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
