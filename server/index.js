import { createApp } from './app.js';
import { assertCriticalConfig } from './config.js';
import { connectDatabase } from './db.js';
import { getMailer } from './services/emailService.js';

async function bootstrap() {
  assertCriticalConfig();
  await connectDatabase();
  await getMailer();

  const app = createApp();
  const port = Number(process.env.PORT || 5000);

  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
