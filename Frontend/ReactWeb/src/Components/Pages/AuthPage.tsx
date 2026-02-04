import { useState } from 'react';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import { PageContainer } from '../UI/PageContainer';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <PageContainer>
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Sign in to your kitchen' : 'Create your account'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex gap-2 mb-6 bg-bg-secondary rounded-lg p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                mode === 'register'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? <Login /> : <Register onSuccess={() => setMode('login')} />}
        </div>
      </div>
    </div>
    </PageContainer>
  );
}