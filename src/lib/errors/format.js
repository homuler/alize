'use strict';

function typeError(prop, type, value) {
  return `"${prop}" type must be ${type}, but is ${typeof value}`;
}

function enumError(prop, arr, value) {
  const enumStr = arr.map(x => `"${x}"`).join(', ');
  return `"${prop}" value must be in ${enumStr}, but is ${value}`;
}

function missingParam(prop) {
  return `property "${prop}" is missing`;
}

function extraParam(prop) {
  return `property "${prop}" is forbidden`;
}

export default {
  typeError,
  enumError,
  missingParam,
  extraParam,
};
