import type { FastifyError, FastifyInstance, FastifyReply } from 'fastify';

interface ProblemDetails {
  type: 'about:blank';
  title: string;
  status: number;
  detail: string;
  instance: string;
  requestId: string;
  code: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

function sendProblem(reply: FastifyReply, problem: ProblemDetails) {
  return reply
    .status(problem.status)
    .type('application/problem+json')
    .send(problem);
}

function validationField(
  validationError: NonNullable<FastifyError['validation']>[number],
): string {
  if (validationError.instancePath) {
    return validationError.instancePath;
  }

  if (
    typeof validationError.params === 'object' &&
    validationError.params !== null &&
    'missingProperty' in validationError.params &&
    typeof validationError.params.missingProperty === 'string'
  ) {
    return validationError.params.missingProperty;
  }

  return 'request';
}

export function registerErrorHandling(app: FastifyInstance): void {
  app.setNotFoundHandler((request, reply) =>
    sendProblem(reply, {
      code: 'NOT_FOUND',
      detail: 'The requested resource was not found.',
      instance: request.url,
      requestId: request.id,
      status: 404,
      title: 'Not Found',
      type: 'about:blank',
    }),
  );

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.validation) {
      request.log.warn({ err: error }, 'request validation failed');

      return sendProblem(reply, {
        code: 'VALIDATION_ERROR',
        detail: 'One or more request fields are invalid.',
        errors: error.validation.map((validationError) => ({
          field: validationField(validationError),
          message: validationError.message ?? 'Invalid value.',
        })),
        instance: request.url,
        requestId: request.id,
        status: 400,
        title: 'Request Validation Failed',
        type: 'about:blank',
      });
    }

    const status =
      error.statusCode && error.statusCode >= 400 && error.statusCode < 500
        ? error.statusCode
        : 500;

    if (status >= 500) {
      request.log.error({ err: error }, 'request failed');
    } else {
      request.log.warn({ err: error }, 'request failed');
    }

    return sendProblem(reply, {
      code: status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
      detail:
        status >= 500
          ? 'An unexpected error occurred.'
          : 'The request could not be completed.',
      instance: request.url,
      requestId: request.id,
      status,
      title: status >= 500 ? 'Internal Server Error' : 'Request Error',
      type: 'about:blank',
    });
  });
}
