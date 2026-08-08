import serverless from 'serverless-http';
import { createApp } from '../../server/app.js';
import { assertCriticalConfig } from '../../server/config.js';
import { connectDatabase } from '../../server/db.js';
import { getMailer } from '../../server/services/emailService.js';

let handlerPromise;

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      assertCriticalConfig();
      await connectDatabase();
      await getMailer();
      return serverless(createApp());
    })();
  }

  return handlerPromise;
}

export async function handler(event, context) {
  const resolvedHandler = await getHandler();
  return resolvedHandler(event, context);
}
