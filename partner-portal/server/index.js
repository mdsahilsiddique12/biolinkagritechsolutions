import { createApp } from './app.js';
import { config } from './config.js';
import { connectDatabase } from './db.js';

async function startServer() {
  await connectDatabase();
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`🚀 Partner Portal API running on port ${config.port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal partner portal startup error:', err);
  process.exit(1);
});
