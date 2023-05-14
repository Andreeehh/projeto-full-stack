import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/App';
import { ProductsProvider } from './contexts/ProductsProvider';
import { PacksProvider } from './contexts/PacksProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PacksProvider>
    <ProductsProvider>
      <App />
    </ProductsProvider>
  </PacksProvider>,
);
