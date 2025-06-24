import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, firebaseUser, isLoading, error, login, register, updateUser, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !firebaseUser) {
    return (
      <LoginForm 
        onLogin={login} 
        onRegister={register}
        error={error}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Dashboard 
      user={user} 
      firebaseUser={firebaseUser}
      updateUser={updateUser} 
      onLogout={logout} 
    />
  );
}

export default App;