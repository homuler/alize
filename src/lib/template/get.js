'use strict';

export default function getGenerator(baseUrl) {
  return {
    get: {
      url: baseUrl,
      method: 'get',
    },
  };
}
