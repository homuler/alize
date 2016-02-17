'use strict';

import alize from 'index';
import FetchExecutor from './FetchExecutor';

import _ from 'lodash/wrapperLodash';
import mixin from 'lodash/mixin';
import get from 'lodash/get';

mixin(_, { get });

require('../scss/alize-viewer.scss');

export default class AlizeViewer extends React.Component {
  constructor(props) {
    super(props);

    const alizeObj = alize.setup(props.config);
    this.state = {
      alize: alizeObj,
    };
  }

  render() {
    const urlMap = this.state.alize.getUrlMap();
    const fetchExs = [...urlMap.values()].reduce((res, v) => {
      for (const method in v) {
        if (!v.hasOwnProperty(method)) {
          continue;
        }
        res.push(v[method]);
      }
      return res;
    }, []).map((urlConfig, idx) => {
      const fetch = _.get(this.state.alize,
          `client.${urlConfig.path}.${urlConfig.name}`);
      return (<FetchExecutor key={ `urlconf-${idx}` }
          config={ urlConfig } fetch={ fetch } />);
    });

    return (
      <div className='alize-viewer'>
        <div>Alize Configuration Example</div>
        <div className='rest-client'>{ fetchExs }</div>
      </div>
    );
  }
}
