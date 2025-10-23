import React, { useState } from 'react';
import { Key, Lock, LogIn, AlertCircle, User } from 'lucide-react';
import { auth } from '../firebase';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await auth.signInWithEmailAndPassword(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center h-full project-content-animation p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary">
            Admin Login
          </h1>
          <p className="text-sm text-secondary mt-1">
            Enter your administrator credentials.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium sr-only"
            >
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                 <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
               </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-200 dark:bg-slate-700/50 pl-10 py-2.5 text-primary placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium sr-only"
            >
              Password
            </label>
             <div className="mt-1 relative rounded-md shadow-sm">
               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                 <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
               </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-200 dark:bg-slate-700/50 pl-10 py-2.5 text-primary placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-sm text-red-500 dark:text-red-400">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-accent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-darker focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              <LogIn size={16} />
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;