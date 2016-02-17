'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import AlizeViewer from './AlizeViewer';

const config = {
  urls: [
    {
      url: '/api/v1/hello',
      method: 'get',
    },
    {
      url: '/api/v1/hello',
      method: 'post',
    },
    {
      url: '/api/v1/hello/:id',
      method: 'delete',
    },
  ],
};

ReactDOM.render(React.createElement(AlizeViewer, { config }), document.getElementById('main'));
