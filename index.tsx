
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UnderConstruction from './components/UnderConstruction';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Simple path-based routing for MVP restriction
const currentPath = window.location.pathname;
const isMVP = currentPath === '/MVP' || currentPath.startsWith('/MVP/');

root.render(
  <React.StrictMode>
    {isMVP ? <App /> : <UnderConstruction />}
  </React.StrictMode>
);
