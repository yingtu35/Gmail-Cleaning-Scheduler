class Logger {
  private isDebug: boolean;

  constructor() {
    // Set debug mode (control this based on environment or config)
    this.isDebug = process.env.NODE_ENV === 'development';
  }

  info(message: any, ...optionalParams: any[]) {
    console.info(`INFO: ${message}`, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(`WARN: ${message}`, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.isDebug) {
      console.debug(`DEBUG: ${message}`, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`ERROR: ${message}`, ...optionalParams);
  }
}

const log = new Logger();
export default log;
