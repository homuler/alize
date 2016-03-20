'use strict';

import AlizeConfig from 'data/alizeConfig';
import Alize from 'alize';


describe('Alize Test', () => {
  let alize;

  describe('Alize Test (Stub)', () => {
    beforeEach(() => {
      alize = new Alize(new AlizeConfig());
    });

    afterEach(() => {
    });
  });

  describe('Alize Test (not Stub)', () => {
    beforeEach(() => {
      alize = new Alize(new AlizeConfig());
    });
    it('initialize', () => {
      expect(alize).to.be.ok;
    });

    it('register urls with config objct', () => {
    });
  });

  describe('Fetch Test', () => {

  });

  describe('Configuration test', () => {
    it('maximum config', () => {
      const config = {
        urls: [
          {
            url: '/api/v1/hello',
            method: 'get',
            assert: {
              pre: {
                x: {
                  require: true,
                  type: 'number',
                },
              },
              post: {
                message: {
                  require: true,
                  type: 'string',
                },
              },
            },
            process: {
              pre: (data) => {
                return data;
              },
              post: (data) => {
                return data;
              },
            },
          },
        ],
        options: {
          headers: {
            'content-type': 'application/json',
          },
          logMode: 'debug',
        },
      };

      const alizeConf = new AlizeConfig(config);
      const alizeObj = new Alize(alizeConf);
      alizeObj.client.api.v1.hello.get();
    });
  });
});
