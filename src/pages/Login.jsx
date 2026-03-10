// Página de login usando Supabase Auth
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/', { replace: true });
      } else {
        await signUp(email, password);
        setErrorMsg('Cadastro realizado. Verifique seu e-mail para confirmar a conta.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800 text-center">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h1>

        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-slate-700">E-mail</label>
            <input
              type="email"
              required
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-700">Senha</label>
            <input
              type="password"
              required
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button
                type="button"
                className="text-sky-600 hover:underline"
                onClick={() => setMode('signup')}
              >
                Criar agora
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button
                type="button"
                className="text-sky-600 hover:underline"
                onClick={() => setMode('login')}
              >
                Fazer login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

