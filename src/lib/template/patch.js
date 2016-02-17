'use strict';

export default function patchGenerator(baseUrl) {
  return {
    patch: {
      url: baseUrl,
      method: 'patch',
    },
  };
}
