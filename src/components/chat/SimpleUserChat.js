// components/chat/SimpleUserChat.js
import React from 'react';
import { Chat, Channel, MessageList, MessageInput, Window } from 'stream-chat-react';
import { MessageCircle, LogOut, ArrowLeft } from 'lucide-react';
import { STREAM_CONFIG } from '../../utils/constants';

const SimpleUserChat = ({
    chatClient,
    channel,
    currentUser,
    onCloseChat,
    onLogout
}) => {
    if (!channel) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <MessageCircle style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>Conectando con el administrador...</p>
                </div>
            </div>
        );
    }

    return (
        <Chat client={chatClient} theme="str-chat__theme-light">
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                {/* Header personalizado para usuarios */}
                <div style={{
                    background: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={onCloseChat}
                            style={{
                                padding: '0.5rem',
                                border: 'none',
                                background: '#f3f4f6',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                color: '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>

                        <div>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                margin: 0
                            }}>
                                Chat con Administrador
                            </h2>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                margin: 0
                            }}>
                                Enviando como: {currentUser.username}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Indicador de admin online */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: '#f0fdf4',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#15803d'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: '#22c55e',
                                borderRadius: '50%'
                            }}></div>
                            Admin disponible
                        </div>

                        <button
                            onClick={onLogout}
                            style={{
                                padding: '0.5rem',
                                border: 'none',
                                background: '#fef2f2',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                color: '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Desconectar"
                        >
                            <LogOut style={{ width: '1rem', height: '1rem' }} />
                        </button>
                    </div>
                </div>

                {/* Mensaje de bienvenida */}
                <div style={{
                    padding: '1rem 1.5rem',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        textAlign: 'center'
                    }}>
                        <MessageCircle style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto 0.5rem', color: '#6366f1' }} />
                        <p style={{ margin: 0 }}>
                            Este es tu chat privado con el administrador.<br />
                            Puedes escribir cualquier pregunta o comentario.
                        </p>
                    </div>
                </div>

                {/* Área de chat SIN SIDEBAR - Solo el canal */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Channel channel={channel}>
                        {/* IMPORTANTE: NO usar Window aquí para evitar el layout con sidebar */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'calc(100vh - 140px)' // Ajustar según altura del header
                        }}>
                            {/* Lista de mensajes */}
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <MessageList />
                            </div>

                            {/* Input de mensaje */}
                            <div style={{
                                borderTop: '1px solid #e5e7eb',
                                background: 'white'
                            }}>
                                <MessageInput
                                    placeholder={`Escribe tu mensaje para ${STREAM_CONFIG.ADMIN_USERNAME}...`}
                                />
                            </div>
                        </div>
                    </Channel>
                </div>
            </div>
        </Chat>
    );
};

export default SimpleUserChat;