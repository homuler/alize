'use strict';

import AlizeConfig from 'data/alizeConfig';

describe('AlizeCofig Test', () => {
  let config;

  describe('AlizeConfig Test (Stub)', () => {
    beforeEach(() => {
      sinon.stub(AlizeConfig.prototype, 'extendsTemplate');
      sinon.stub(AlizeConfig.prototype, 'registerLazyTemplate');
      sinon.stub(AlizeConfig.prototype, 'extendsOption');

      config = new AlizeConfig();
    });

    afterEach(() => {
      AlizeConfig.prototype.extendsTemplate.restore();
      AlizeConfig.prototype.registerLazyTemplate.restore();
      AlizeConfig.prototype.extendsOption.restore();
    });

    it('extendsTemplate call', () => {
      expect(config.extendsTemplate.called).to.be.true;
    });

    it('registerLazyTemplate call', () => {
      expect(config.registerLazyTemplate.calledOnce).to.be.true;
    });

    it('extendsOption call', () => {
      expect(config.extendsOption.calledOnce).to.be.true;
    });
  });

  describe('AlizConfig Test (not Stub)', () => {
    beforeEach(() => {
      config = new AlizeConfig();
    });
    it('initialize', () => {
      config = new AlizeConfig();
      expect(config).to.be.ok;

      expect(config).to.have.property('urls');
      expect(config).to.have.property('template');
      expect(config).to.have.property('option');
    });

    it('extends template', () => {
      expect(config.template).not.to.have.property('mock');
      config.extendsTemplate({ mock() {} });
      expect(config.template).to.have.property('mock');
    });

    it('extends option', () => {
      expect(config.option).not.to.have.property('mock');
      config.extendsOption({ mock: 'something' });
      expect(config.option).to.have.property('mock');
    });
  });
});
