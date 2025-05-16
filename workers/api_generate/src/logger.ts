export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  private level: LogLevel;
  private context: string;

  constructor(context: string, level: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.level = level;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (level > this.level) return;

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const logEntry = {
      timestamp,
      level: levelName,
      context: this.context,
      message,
      data,
    };

    console.log(JSON.stringify(logEntry));
  }

  error(message: string, error?: Error | any) {
    this.log(LogLevel.ERROR, message, {
      error: error?.message,
      stack: error?.stack,
      details: error,
    });
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}