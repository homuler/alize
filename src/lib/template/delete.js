'use strict';

export default function deleteGenerator(baseUrl) {
  return {
    'delete': {
      url: baseUrl,
      method: 'delete',
    },
  };
}
