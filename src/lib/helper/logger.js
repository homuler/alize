'use strict';

export class Logger {
  constructor() {
    this.logLevel = 0;
  }

  debug(...params) {
    if (this.logLevel < 5) {
      return;
    }
    if (console && console.debug) {
      console.debug(...params);
    }
  }

  log(...params) {
    if (this.logLevel < 4) {
      return;
    }
    if (console && console.log) {
      console.log(...params);
    } else {
      const currentLevel = this.logLevel;
      this.setMode('debug');
      this.debug(...params);
      this.setLogLevel(currentLevel);
    }
  }

  info(...params) {
    if (this.logLevel < 3) {
      return;
    }
    if (console && console.info) {
      console.info(...params);
    } else {
      const currentLevel = this.logLevel;
      this.setMode('log');
      this.log(...params);
      this.setLogLevel(currentLevel);
    }
  }
  warn(...params) {
    if (this.logLevel < 2) {
      return;
    }
    if (console && console.warn) {
      console.warn(...params);
    } else {
      const currentLevel = this.logLevel;
      this.setMode('info');
      this.info(...params);
      this.setLogLevel(currentLevel);
    }
  }

  error(...params) {
    if (this.logLevel < 1) {
      return;
    }
    if (console && console.error) {
      console.error(...params);
    } else {
      const currentLevel = this.logLevel;
      this.setMode('warn');
      this.warn(...params);
      this.setLogLevel(currentLevel);
    }
  }

  assert(...params) {
    if (console.assert) {
      console.assert(...params);
    } else {
      return;
    }
  }

  setMode(mode) {
    switch (mode) {
      case 'silent':
        this.setLogLevel(0);
        break;
      case 'error':
        this.setLogLevel(1);
        break;
      case 'warn':
        this.setLogLevel(2);
        break;
      case 'info':
        this.setLogLevel(3);
        break;
      case 'log':
        this.setLogLevel(4);
        break;
      case 'debug':
        this.setLogLevel(5);
        break;
      default:
        this.setLogLevel(0);
        break;
    }
  }

  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }
}

const logger = new Logger();
export default logger;
