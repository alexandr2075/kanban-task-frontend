import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { setupInterceptorsTo } from '~/utils/axiosInterceptors';
import { store } from './store';
import App from './App';

setupInterceptorsTo(axios);

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

window.addEventListener('message', e => {
  if (e.data && typeof e.data === 'string' && e.data.match(/webpackHotUpdate/)) {
    console.clear();
  }
});
