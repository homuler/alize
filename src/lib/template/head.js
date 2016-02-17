'use strict';

export default function headGenerator(baseUrl) {
  return {
    head: {
      url: baseUrl,
      method: 'head',
    },
  };
}
