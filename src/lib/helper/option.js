'use strict';

import format from 'errors/format';

export function assertJSON(json, config, path = '') {
  for (const prop in config) {
    if (!config.hasOwnProperty(prop)
        || typeof config[prop] !== 'object' || config[prop] === null) {
      continue;
    }
    const { type, checks, children } = config[prop];
    const propPath = path.length > 0 ? `${path}.${prop}` : prop;

    // type check
    if (type && json[prop] !== void(0) && typeof json[prop] !== type) {
      throw new TypeError(format.typeError(propPath, type, json[prop]));
    }

    // other checks
    if (checks) {
      if (checks.enum) {
        assertEnum(json, prop, checks.enum, propPath);
      }

      if (checks.require) {
        assertRequire(json, prop, checks.require, propPath);
      }

      if (checks.forbid) {
        assertForbid(json, prop, checks.forbid, propPath);
      }
    }
    if (children && json[prop] && typeof json[prop] === 'object') {
      assertJSON(json[prop], children, propPath);
    }
  }

  for (const prop in json) {
    if (!json.hasOwnProperty(prop)) {
      continue;
    }
    if (!config.hasOwnProperty(prop)) {
      const propPath = path.length > 0 ? `${path}.${prop}` : prop;
      logger.warn(`property "${propPath}" is not specified in config`);
    }
  }
}

export function assertEnum(obj, prop, { array, error }, path) {
  if (obj == null) {
    return;
  }
  if (obj[prop] == null) {
    return;
  }
  if (array) {
    if (Reflect.apply(Array.prototype.includes, array, [obj[prop]])) {
      return;
    }
    if (error) {
      throw new Error(error(obj, prop, path));
    }
    throw new Error(format.enumError(path, array, obj[prop]));
  } else {
    throw new Error('Invalid enum config: property "array" is missing');
  }
}

export function checkCondition(obj, { absent, present }) {
  if (obj == null) {
    return false;
  }
  if (absent && typeof absent === 'object') {
    for (const p of absent) {
      if (obj[p] != null) {
        continue;
      }
      return true;
    }
  }

  if (present && typeof present === 'object') {
    for (const p of present) {
      if (obj[p] != null) {
        return true;
      }
    }
  }
  return false;
}

export function assertRequire(obj, prop, { when, error }, path) {
  let condition = true;
  if (when) {
    if (typeof when !== 'object' || when === null) {
      throw new TypeError(format.typeError('when', 'object', when));
    }
    condition = checkCondition(obj, when);
  }

  if (condition) {
    if (obj[prop] != null) {
      return;
    }
    if (error) {
      throw new Error(error(obj, prop, path));
    }
    throw new Error(format.missingParam(path));
  }
}

export function assertForbid(obj, prop, { when, error }, path) {
  let condition = true;
  if (when) {
    if (typeof when !== 'object' || when === null) {
      throw new TypeError(format.typeError('when', 'object', when));
    }
    condition = checkCondition(obj, when);
  }

  if (condition) {
    if (obj[prop] == null) {
      return;
    }
    if (error) {
      throw new Error(error(obj, prop, path));
    }
    throw new Error(format.extraParam(path));
  }
}

export function calcAccessPath(urlConfig, root = 'root') {
  if (urlConfig.path) {
    return urlConfig.path;
  }
  return urlToAccessPath(urlConfig.url);

  function urlToAccessPath(urlStr) {
    let accessPath = urlStr.split('/')
      .filter(x => x.length && x[0] !== ':')
      .join('.');
    if (accessPath.length > 0 && accessPath[0] === '.') {
      accessPath = accessPath.substr(1);
    }
    return accessPath.length > 0 ? accessPath : root;
  }
}

export function injectParamsToUrl(urlStr, params = {}) {
  return urlStr.split('/').map(str => {
    if (str.length > 1 && str[0] === ':') {
      const paramKey = str.substr(1);
      if (paramKey in params) {
        return params[paramKey];
      }
      // TODO: obscure
      throw new Error(format.missingParam(paramKey));
    }
    return str;
  }).join('/');
}

export default {
  assertJSON,
  assertEnum,
  checkCondition,
  assertRequire,
  assertForbid,
  calcAccessPath,
  injectParamsToUrl,
};
