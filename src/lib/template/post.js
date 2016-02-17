'use strict';

export default function postGenerator(baseUrl) {
  return {
    post: {
      url: baseUrl,
      method: 'post',
    },
  };
}
