'use strict';

const urlNoConflict = {
  urls: [
    {
      url: '/',
      method: 'get',
    },
    {
      url: '/api',
      method: 'post',
    },
  ],
};

const urlConflict = {
  urls: [
    {
      url: '/',
      method: 'get',
    },
    {
      url: '/',
      method: 'post',
    },
    {
      url: '/api/v1/foo',
      method: 'get',
    },
    {
      url: '/api/v1/foo',
      method: 'post',
    },
  ],
};

const methodConflict = {
  urls: [
    {
      url: '/',
      method: 'get',
    },
    {
      url: '/',
      method: 'get',
    },
    {
      url: '/api/v1/foo',
      method: 'get',
    },
    {
      url: '/api/v1/foo',
      method: 'get',
    },
    {
      url: '/api/v1/foo/:id',
      method: 'get',
    },
  ],
};

const methodConflictWithAlias = {
  urls: [
    {
      url: '/',
      method: 'get',
      alias: 'index',
    },
    {
      url: '/',
      method: 'get',
    },
    {
      url: '/api/v1/foo',
      method: 'get',
    },
    {
      url: '/api/v1/foo/:id',
      method: 'get',
      alias: 'foo',
    },
  ],
};

const aliasConflict = {
  urls: [
    {
      url: '/',
      method: 'get',
      alias: 'root',
    },
    {
      url: '/',
      method: 'get',
    },
    {
      url: '/api/v1/foo',
      method: 'get',
      alias: 'foo',
    },
    {
      url: '/api/v1/foo',
      method: 'get',
      alias: 'foo',
    },
    {
      url: '/api/v1/foo',
      method: 'post',
      alias: 'foo',
    },
    {
      url: '/api/v1/bar',
      method: 'delete',
      alias: 'api.bar',
    },
    {
      url: '/api/v2/bar',
      method: 'delete',
      alias: 'api.bar',
    },
  ],
};

const templateNoConflict = {
  urls: [
    {
      url: '/api/v1/foo',
      template: 'resources',
    },
    {
      url: '/api/v1/foo',
      tempate: 'rest',
    },
    {
      url: '/api/v1/foo/bar',
      template: 'rest',
    },
  ],
};

const templateConflict = {
  urls: [
    {
      url: '/api/v1/foo',
      template: 'resources',
    },
    {
      url: '/api/v1/foo',
      template: 'resources',
    },
    {
      url: '/api/v1/bar',
      method: 'get',
    },
    {
      url: '/api/v1/bar',
      template: 'rest',
    },
    {
      url: '/api/v1/foo/bar',
      template: 'resources',
      alias: 'api.v1.bar',
    },
  ],
};

export default {
  urlNoConflict,
  urlConflict,
  methodConflict,
  methodConflictWithAlias,
  aliasConflict,
  templateConflict,
  templateNoConflict,
};
