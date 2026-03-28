import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './pages/App';
import './styles.css';
import { worker } from './mocks/browser';

if (import.meta.env.DEV) {
  worker.start({ onUnhandledRequest: 'bypass' });
}

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
