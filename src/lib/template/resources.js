'use strict';

export default function resourcesGenerator(baseUrl) {
  return {
    'index': {
      url: baseUrl,
      method: 'get',
    },
    'show': {
      url: `${baseUrl}/:id`,
      method: 'get',
    },
    'new': {
      url: baseUrl,
      method: 'get',
    },
    'create': {
      url: baseUrl,
      method: 'post',
    },
    'edit': {
      url: `${baseUrl}/:id/edit`,
      method: 'get',
    },
    'update': {
      url: `${baseUrl}/:id`,
      method: 'put',
    },
    'destroy': {
      url: `${baseUrl}/:id`,
      method: 'delete',
    },
  };
}
