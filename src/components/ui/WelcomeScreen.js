// components/ui/WelcomeScreen.js
import React from 'react';
import { MessageCircle, LogOut, Crown, User } from 'lucide-react';

const WelcomeScreen = ({ currentUser, isAdmin, onOpenChat, onLogout }) => {
    return (
        <div className="modern-main-screen">
            <div className="modern-main-content">
                <div className="modern-chat-icon-wrapper">
                    <button
                        onClick={onOpenChat}
                        className="modern-chat-icon-btn"
                        style={{
                            background: isAdmin ? '#f59e0b' : '#2563eb'
                        }}
                    >
                        {isAdmin ? (
                            <Crown className="w-16 h-16" />
                        ) : (
                            <MessageCircle className="w-16 h-16" />
                        )}
                    </button>
                </div>

                <h2 className="modern-welcome-title">
                    ¡Hola, {currentUser.username}! {isAdmin && '👑'}
                </h2>

                <p className="modern-welcome-subtitle">
                    {isAdmin
                        ? 'Panel de administrador - Gestiona todos los chats de FortunaChat'
                        : 'Haz clic en el icono para enviar un mensaje al administrador'
                    }
                </p>

                {/* Información adicional para usuario regular */}
                {!isAdmin && (
                    <div style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                        marginTop: '1rem',
                        textAlign: 'left',
                        maxWidth: '400px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <User style={{ width: '1rem', height: '1rem', color: '#6366f1' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                Tu chat personal
                            </span>
                        </div>
                        <ul style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: 0,
                            paddingLeft: '1.25rem',
                            lineHeight: '1.5'
                        }}>
                            <li>Comunícate directamente con el administrador</li>
                            <li>Tus mensajes son privados y seguros</li>
                            <li>Recibe respuestas rápidas a tus consultas</li>
                        </ul>
                    </div>
                )}

                <div className="modern-status-indicator">
                    <div className="modern-status-dot"></div>
                    {isAdmin ? 'Admin conectado' : 'Conectado a FortunaChat'}
                </div>

                <button
                    onClick={onLogout}
                    className="modern-logout-btn"
                >
                    <LogOut className="w-4 h-4" />
                    Desconectar
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;