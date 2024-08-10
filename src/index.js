import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PageDataProvider } from './context/PageContext';
import { DataProvider } from './context/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PageDataProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </PageDataProvider>
  </React.StrictMode>
);
