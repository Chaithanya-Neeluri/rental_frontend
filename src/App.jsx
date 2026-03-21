import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Root application shell with global providers
const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-hero-gradient bg-slate-950 text-slate-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;

