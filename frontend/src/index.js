import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/app.css';
import './css/login.css';
import './css/header.css';
import './css/addWorkout.css';
import './css/exercise.css';
import './css/history.css';
import App from './App';
import { PageDataProvider } from './context/PageContext';
import { DataProvider } from './context/DataContext';
import RequestContext, { RequestProvider } from './context/RequestContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PageDataProvider>
      <DataProvider>
        <RequestProvider>
          <App />
        </RequestProvider>
      </DataProvider>
    </PageDataProvider>
  </React.StrictMode>
);
