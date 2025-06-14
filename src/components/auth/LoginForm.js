// components/auth/LoginForm.js
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const LoginForm = ({ onLogin, onSwitchToRegister, isLoading }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await onLogin(loginData);
      setLoginData({ username: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modern-form">
      {error && (
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#fef2f2', 
          color: '#dc2626', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="modern-input-group">
          <label className="modern-input-label">Usuario</label>
          <div className="modern-input-container">
            <User className="modern-input-icon" />
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              className="modern-input"
              placeholder="Tu nombre de usuario"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="modern-input-group">
          <label className="modern-input-label">Contraseña</label>
          <div className="modern-input-container">
            <Lock className="modern-input-icon" />
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="modern-input"
              placeholder="Tu contraseña"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="modern-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <button
          type="button"
          onClick={onSwitchToRegister}
          className="modern-btn-secondary"
          disabled={isLoading}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
};

export default LoginForm;