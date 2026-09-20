import { afterEach, describe, expect, it } from 'vitest';

import { buildApp } from './app.js';

const apps: Array<ReturnType<typeof buildApp>> = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('API foundation', () => {
  it('exposes an operational liveness endpoint', async () => {
    const app = buildApp({ logger: false });
    apps.push(app);

    const response = await app.inject({ method: 'GET', url: '/health/live' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('returns a safe problem response for unknown routes', async () => {
    const app = buildApp({ logger: false });
    apps.push(app);

    const response = await app.inject({ method: 'GET', url: '/not-a-route' });

    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    );
    expect(response.json()).toMatchObject({
      code: 'NOT_FOUND',
      status: 404,
      title: 'Not Found',
    });
    expect(response.body).not.toContain('stack');
  });
});
