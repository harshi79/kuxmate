import process from 'node:process';

const environments = ['development', 'test', 'production'] as const;
const logLevels = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
] as const;

type NodeEnvironment = (typeof environments)[number];
type LogLevel = (typeof logLevels)[number];

function readEnvironment(value: string | undefined): NodeEnvironment {
  const environment = value ?? 'development';

  if (!environments.includes(environment as NodeEnvironment)) {
    throw new Error(`NODE_ENV must be one of: ${environments.join(', ')}`);
  }

  return environment as NodeEnvironment;
}

function readPort(value: string | undefined): number {
  const port = Number(value ?? '4000');

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
}

function readLogLevel(value: string | undefined): LogLevel {
  const logLevel = value ?? 'info';

  if (!logLevels.includes(logLevel as LogLevel)) {
    throw new Error(`LOG_LEVEL must be one of: ${logLevels.join(', ')}`);
  }

  return logLevel as LogLevel;
}

export const config = {
  host: process.env.HOST ?? '0.0.0.0',
  logLevel: readLogLevel(process.env.LOG_LEVEL),
  nodeEnv: readEnvironment(process.env.NODE_ENV),
  port: readPort(process.env.PORT),
} as const;
