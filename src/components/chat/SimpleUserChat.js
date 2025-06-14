// components/chat/SimpleUserChat.js
import React, { useEffect, useState } from 'react';
import { Chat, Channel, MessageList, MessageInput, Window } from 'stream-chat-react';
import { MessageCircle, LogOut, ArrowLeft, ExternalLink, Globe, CreditCard, DollarSign, HelpCircle } from 'lucide-react';
import { STREAM_CONFIG } from '../../utils/constants';

const SimpleUserChat = ({
    chatClient,
    channel,
    currentUser,
    onCloseChat,
    onLogout
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSinocaClick = () => {
        window.open('https://caipiria.com', '_blank', 'noopener,noreferrer');
    };

    // Mensajes sugeridos - SOLO 2 OPCIONES
    const suggestedMessages = [
        {
            id: 1,
            text: "Quiero pedir CBU",
            shortText: "Pedir CBU",
            icon: CreditCard,
            color: "#3b82f6",
            width: "70%" // 70% del ancho
        },
        {
            id: 2,
            text: "Quiero retirar mi dinero",
            shortText: "Retirar",
            icon: DollarSign,
            color: "#10b981",
            width: "30%" // 30% del ancho
        }
    ];

    const handleSuggestedMessageClick = async (messageText) => {
        if (channel) {
            try {
                await channel.sendMessage({
                    text: messageText,
                    user: { id: currentUser.username }
                });
            } catch (error) {
                console.error('Error enviando mensaje sugerido:', error);
            }
        }
    };

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

    const containerStyle = {
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        padding: isMobile ? '0 0.5rem 0.5rem 0.5rem' : '0 1rem',
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 1rem)' : '1rem'
    };

    const mainContainerStyle = {
        width: '100%',
        maxWidth: isMobile ? '100%' : '800px',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        borderRadius: isMobile ? '0.75rem' : '0 0 1rem 1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginTop: isMobile ? '0.5rem' : '0',
        marginBottom: isMobile ? '1rem' : '0'
    };

    const chatAreaStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile
            ? 'calc(100vh - 320px)' // Más espacio sin mensaje de bienvenida
            : 'calc(100vh - 280px)'
    };

    const messageListStyle = {
        flex: 1,
        overflow: 'auto', // Cambio a auto para scroll independiente
        minHeight: isMobile ? '200px' : '300px', // Más altura para mensajes
        maxHeight: isMobile ? 'calc(100vh - 320px)' : 'calc(100vh - 280px)', // Altura máxima
        paddingBottom: isMobile ? '0.5rem' : '0.25rem'
    };

    const inputContainerStyle = {
        borderTop: '1px solid #e5e7eb',
        background: 'white',
        paddingBottom: isMobile ? '1rem' : '0.5rem',
        paddingTop: '0.5rem',
        position: 'sticky', // Hacer que siempre esté visible
        bottom: 0,
        zIndex: 10
    };

    // Botón SINOCA moderno
    const sinocaButtonStyle = {
        width: '100%',
        padding: isMobile ? '1rem 1.5rem' : '1.25rem 2rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        border: 'none',
        borderRadius: '1rem',
        color: 'white',
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(99, 102, 241, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    // Estilos para mensajes sugeridos
    const suggestedMessagesContainerStyle = {
        padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
        background: '#f8fafc',
        borderTop: '1px solid #e5e7eb'
    };

    const suggestedMessagesGridStyle = {
        display: 'flex', // Cambio a flex para control de ancho personalizado
        gap: isMobile ? '0.5rem' : '0.75rem',
        width: '100%'
    };

    const getSuggestedMessageStyle = (color, width) => ({
        padding: isMobile ? '0.75rem 0.5rem' : '1rem 1.25rem',
        background: 'white',
        border: `2px solid ${color}20`,
        borderRadius: isMobile ? '0.75rem' : '0.75rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '0.25rem' : '0.75rem',
        fontSize: isMobile ? '0.7rem' : '0.875rem',
        fontWeight: '600',
        color: '#374151',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        minHeight: isMobile ? '4rem' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        width: width, // Ancho personalizado
        flex: 'none' // No crecer ni encoger
    });

    return (
        <Chat client={chatClient} theme="str-chat__theme-light">
            <div style={containerStyle}>
                <div style={mainContainerStyle}>
                    {/* Header personalizado para usuarios */}
                    <div style={{
                        background: 'white',
                        borderBottom: '1px solid #e5e7eb',
                        padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem' }}>
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
                                    fontSize: isMobile ? '1rem' : '1.125rem',
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    margin: 0
                                }}>
                                    Chat con Administrador
                                </h2>
                                <p style={{
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    color: '#6b7280',
                                    margin: 0
                                }}>
                                    Enviando como: {currentUser.username}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: isMobile ? '0.25rem 0.5rem' : '0.5rem 0.75rem',
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
                                {!isMobile && 'Admin disponible'}
                                {isMobile && 'Online'}
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

                    {/* Botón SINOCA - ARRIBA Y MODERNO */}
                    <div style={{
                        padding: isMobile ? '1.25rem 1rem' : '1.5rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <button
                            onClick={handleSinocaClick}
                            style={sinocaButtonStyle}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                e.target.style.boxShadow = '0 20px 40px -10px rgba(99, 102, 241, 0.5), 0 10px 15px -8px rgba(99, 102, 241, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(99, 102, 241, 0.1)';
                            }}
                            onMouseDown={(e) => {
                                e.target.style.transform = 'translateY(0) scale(0.98)';
                            }}
                            onMouseUp={(e) => {
                                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                            }}
                        >
                            {/* Efecto de brillo */}
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: 'shine 3s infinite',
                                pointerEvents: 'none'
                            }} />

                            {/* Contenido del botón */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <Globe style={{
                                    width: isMobile ? '1.25rem' : '1.5rem',
                                    height: isMobile ? '1.25rem' : '1.5rem',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }} />
                                <span style={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    Ingresar al SINOCA
                                </span>
                                <ExternalLink style={{
                                    width: isMobile ? '1rem' : '1.25rem',
                                    height: isMobile ? '1rem' : '1.25rem',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }} />
                            </div>
                        </button>
                    </div>

                    {/* Área de chat SIN SIDEBAR - Optimizada */}
                    <div style={chatAreaStyle}>
                        <Channel channel={channel}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                position: 'relative'
                            }}>
                                {/* Lista de mensajes con scroll independiente */}
                                <div style={messageListStyle}>
                                    <MessageList />
                                </div>

                                {/* MENSAJES SUGERIDOS - SOLO 2 OPCIONES CON ANCHO PERSONALIZADO */}
                                <div style={suggestedMessagesContainerStyle}>
                                    <div style={{
                                        fontSize: isMobile ? '0.7rem' : '0.875rem',
                                        color: '#6b7280',
                                        marginBottom: isMobile ? '0.5rem' : '0.75rem',
                                        fontWeight: '500',
                                        textAlign: 'center'
                                    }}>
                                        💬 Respuestas rápidas
                                    </div>
                                    <div style={suggestedMessagesGridStyle}>
                                        {suggestedMessages.map((msg) => {
                                            const IconComponent = msg.icon;
                                            return (
                                                <button
                                                    key={msg.id}
                                                    onClick={() => handleSuggestedMessageClick(msg.text)}
                                                    style={getSuggestedMessageStyle(msg.color, msg.width)}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                                        e.target.style.boxShadow = `0 6px 12px -2px ${msg.color}30`;
                                                        e.target.style.borderColor = `${msg.color}60`;
                                                        e.target.style.background = `${msg.color}05`;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'translateY(0) scale(1)';
                                                        e.target.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)';
                                                        e.target.style.borderColor = `${msg.color}20`;
                                                        e.target.style.background = 'white';
                                                    }}
                                                    onTouchStart={(e) => {
                                                        e.target.style.transform = 'scale(0.95)';
                                                        e.target.style.background = `${msg.color}10`;
                                                    }}
                                                    onTouchEnd={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                        e.target.style.background = 'white';
                                                    }}
                                                >
                                                    {/* Efecto de ripple en click */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: `linear-gradient(45deg, ${msg.color}10, transparent)`,
                                                        opacity: 0,
                                                        borderRadius: 'inherit',
                                                        pointerEvents: 'none'
                                                    }} />

                                                    <IconComponent
                                                        style={{
                                                            width: isMobile ? '1.25rem' : '1.25rem',
                                                            height: isMobile ? '1.25rem' : '1.25rem',
                                                            color: msg.color,
                                                            flexShrink: 0,
                                                            filter: `drop-shadow(0 1px 2px ${msg.color}40)`
                                                        }}
                                                    />
                                                    <span style={{
                                                        flex: isMobile ? 'unset' : 1,
                                                        lineHeight: isMobile ? '1.2' : '1.4',
                                                        fontSize: isMobile ? (msg.width === '70%' ? '0.65rem' : '0.6rem') : '0.875rem',
                                                        fontWeight: isMobile ? '700' : '600'
                                                    }}>
                                                        {isMobile ? msg.shortText : msg.text}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Input de mensaje - Siempre visible */}
                                <div style={inputContainerStyle}>
                                    <MessageInput
                                        placeholder={`Escribe tu mensaje para ${STREAM_CONFIG.ADMIN_USERNAME}...`}
                                    />
                                </div>
                            </div>
                        </Channel>
                    </div>
                </div>
            </div>

            {/* Estilos CSS para la animación */}
            <style>
                {`
          @keyframes shine {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
          }
        `}
            </style>
        </Chat>
    );
};

export default SimpleUserChat;