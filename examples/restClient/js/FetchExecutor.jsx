'use strict';

require('../scss/fetch-viewer.scss');

export default class FetchExecutor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: {
        config: false,
        param: false,
      },
      response: null,
    };
  }

  fetch() {
    try {
      const paramJSON = JSON.parse(this.refs.param.value.trim());
      this.props.fetch(paramJSON)
        .then(response => {
          const json = response.json();
          return Promise.resolve(json);
        }, err => {
          this.setState({
            response: err.message,
          });
        })
        .then(json => {
          this.setState({
            response: json,
          });
        }, err => {
          this.setState({
            response: err.message,
          });
        });
    } catch (err) {
      this.setState({
        response: err.message,
      });
    }
  }

  toggleConfig() {
    const openStatus = this.state.open;
    this.setState({
      open: { ...openStatus, config: !openStatus.config },
    });
  }

  toggleParam() {
    const openStatus = this.state.open;
    this.setState({
      open: { ...openStatus, param: !openStatus.param },
    });
  }

  render() {
    const { url, method, path, headers } = this.props.config;
    const headerView = [];

    if (headers) {
      for (const key in headers) {
        if (!headers.hasOwnProperty(key)) {
          continue;
        }
        headerView.push((
          <div className={ `details-table${ this.state.open.config ? ' open' : ''}` }
            key={ `config-${key}` }>
            <div>{ key }</div>
            <div>{ headers[key] }</div>
          </div>
        ));
      }
    }
    return (
      <div className={ `fetch-viewer ${method}-viewer` }>
        <div className='config-title'>
          <div className='summary'>
            <span>{ method.toUpperCase() }</span>
            <span>{ url }</span>
            <span>{ `( path: ${path} )` }</span>
            <button className={ `exec-btn exec-${method}-btn` }
              onClick={ this.fetch.bind(this) }>
              fetch test
            </button>
          </div>
        </div>
        <div className='config-body'>
          <div className='details'>
            <div className='toggle-btn'
              onClick={ this.toggleConfig.bind(this) }>
              Configuration
              <span>
                <i className={ `fa fa-angle-${ this.state.open.config ? 'down' : 'right' }` }>
                </i>
              </span>
            </div>
            { headerView }
          </div>
          <div className='fetch-test-box'>
            <div className='param-input'>
              <div className='toggle-btn'
                onClick={ this.toggleParam.bind(this) }>
                Fetch Parameter
                <span>
                  <i className={ `fa fa-angle-${ this.state.open.param ? 'down' : 'right' }` }>
                  </i>
                </span>
              </div>
              <textarea className={ `${this.state.open.param ? 'open' : '' }` }
                id='param' ref='param' defaultValue={ '{ "urlParam": {}, "data": {} }' }>
              </textarea>
            </div>
            <div className='response'>
              <div className='toggle-btn'>
                Response
              </div>
              <div style={ this.state.response !== null ? { padding: '5px' } : {} }>
                { this.state.response ? JSON.stringify(this.state.response) : null }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FetchExecutor.propTypes = {
  config: React.PropTypes.shape({
    method: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequire,
    path: React.PropTypes.string,
    headers: React.PropTypes.object,
  }).isRequired,
  fetch: React.PropTypes.func.isRequired,
};
