import helmet from '@fastify/helmet';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { type FastifyServerOptions } from 'fastify';
import { Type } from 'typebox';

import { config } from './config.js';
import { registerErrorHandling } from './errors.js';

const healthResponse = Type.Object({
  status: Type.Literal('ok'),
});

export function buildApp(options: Pick<FastifyServerOptions, 'logger'> = {}) {
  const app = Fastify({
    bodyLimit: 1_048_576,
    logger: options.logger ?? {
      level: config.logLevel,
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.secret',
        'req.body.token',
      ],
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(helmet);
  registerErrorHandling(app);

  app.get(
    '/health/live',
    {
      schema: {
        response: {
          200: healthResponse,
        },
      },
    },
    async () => ({ status: 'ok' as const }),
  );

  return app;
}
