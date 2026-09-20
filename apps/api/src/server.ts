import process from 'node:process';

import { buildApp } from './app.js';
import { config } from './config.js';

const app = buildApp();
let shuttingDown = false;

async function shutDown(signal: NodeJS.Signals): Promise<void> {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  app.log.info({ signal }, 'shutting down');

  try {
    await app.close();
  } catch (error) {
    app.log.error({ err: error }, 'graceful shutdown failed');
    process.exitCode = 1;
  }
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void shutDown(signal);
  });
}

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.fatal({ err: error }, 'unable to start API');
  process.exitCode = 1;
}
