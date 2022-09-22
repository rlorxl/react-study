import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from '../../05-ERC/src/store/auth-context';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
