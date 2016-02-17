'use strict';

export function enproxy(func, name, logger) {
  if (Proxy) {
    return new Proxy(func, {
      apply(target, thisArg, args) {
        logger.debug(`${name} called with arguments: ${JSON.stringif(args)}`);
        return target(args);
      },
    });
  }
  return func;
}
