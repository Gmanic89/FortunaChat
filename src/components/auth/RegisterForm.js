// components/auth/RegisterForm.js
import React, { useState } from 'react';
import { User, Lock, UserPlus } from 'lucide-react';
import { STREAM_CONFIG } from '../../utils/constants';

const RegisterForm = ({ onRegister, onSwitchToLogin, isLoading }) => {
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await onRegister(registerData);
            setRegisterData({ username: '', password: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const isAdminUsername = registerData.username === STREAM_CONFIG.ADMIN_USERNAME;

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
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                            className="modern-input"
                            placeholder="Tu nombre de usuario"
                            required
                            minLength={3}
                            disabled={isLoading}
                        />
                    </div>
                    {isAdminUsername && (
                        <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                            👑 Este usuario será administrador
                        </div>
                    )}
                </div>

                <div className="modern-input-group">
                    <label className="modern-input-label">Contraseña</label>
                    <div className="modern-input-container">
                        <Lock className="modern-input-icon" />
                        <input
                            type="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="modern-input"
                            placeholder="Crea una contraseña"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="modern-input-group">
                    <label className="modern-input-label">Confirmar Contraseña</label>
                    <div className="modern-input-container">
                        <Lock className="modern-input-icon" />
                        <input
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            className="modern-input"
                            placeholder="Confirma tu contraseña"
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
                    <UserPlus className="w-5 h-5" />
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>

                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="modern-btn-secondary"
                    disabled={isLoading}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;