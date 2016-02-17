'use strict';

export default function putGenerator(baseUrl) {
  return {
    put: {
      url: baseUrl,
      method: 'put',
    },
  };
}
