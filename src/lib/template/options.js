'use strict';

export default function optionsGenerator(baseUrl) {
  return {
    options: {
      url: baseUrl,
      method: 'options',
    },
  };
}
