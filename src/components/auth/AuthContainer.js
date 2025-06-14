// components/auth/AuthContainer.js
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = ({ onLogin, onRegister, isLoading }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSwitchToRegister = () => setIsRegistering(true);
    const handleSwitchToLogin = () => setIsRegistering(false);

    return (
        <div className="modern-login-container">
            <div className="modern-login-card">
                <div className="modern-login-header">
                    <div className="modern-app-icon">
                        <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="modern-app-title">FortunaChat</h1>
                    <p className="modern-app-subtitle">
                        {isRegistering ? 'Crear nueva cuenta' : 'Bienvenido de vuelta'}
                    </p>
                    <div style={{
                        fontSize: '0.75rem',
                        color: '#10b981',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#10b981',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                        }}></div>
                        Powered by Stream Chat
                    </div>
                </div>

                {isRegistering ? (
                    <RegisterForm
                        onRegister={onRegister}
                        onSwitchToLogin={handleSwitchToLogin}
                        isLoading={isLoading}
                    />
                ) : (
                    <LoginForm
                        onLogin={onLogin}
                        onSwitchToRegister={handleSwitchToRegister}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthContainer;