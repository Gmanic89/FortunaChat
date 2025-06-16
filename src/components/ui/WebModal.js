// components/ui/WebModal.js
import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const WebModal = ({ 
    isOpen, 
    onClose, 
    url = "https://caipiria.com", 
    title = "Pantalla Web" 
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay de fondo */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 9998,
                    backdropFilter: 'blur(4px)'
                }}
                onClick={onClose}
            />

            {/* Modal principal - casi fullscreen */}
            <div style={{
                position: 'fixed',
                top: '2%',
                left: '2%',
                right: '2%',
                bottom: '2%',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                zIndex: 9999,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header del modal */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        margin: 0
                    }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem',
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                    >
                        <X style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                </div>

                {/* Contenido del iframe */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <iframe
                        src={url}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        title={title}
                        allow="fullscreen; microphone; camera"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                    
                    {/* Botón flotante para volver al chat */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            left: '2rem',
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: 10000
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1) translateY(-2px)';
                            e.target.style.boxShadow = '0 20px 35px -5px rgba(99, 102, 241, 0.6), 0 8px 15px -4px rgba(99, 102, 241, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1) translateY(0)';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseDown={(e) => {
                            e.target.style.transform = 'scale(0.95) translateY(-1px)';
                        }}
                        onMouseUp={(e) => {
                            e.target.style.transform = 'scale(1.1) translateY(-2px)';
                        }}
                        title="Volver al chat"
                    >
                        <MessageCircle 
                            style={{ 
                                width: '1.75rem', 
                                height: '1.75rem',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }} 
                        />
                        
                        {/* Efecto de pulso */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.3)',
                            animation: 'pulse 2s infinite',
                            pointerEvents: 'none'
                        }} />
                    </button>
                </div>
            </div>

            {/* CSS para la animación de pulso */}
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 1;
                        }
                        70% {
                            transform: translate(-50%, -50%) scale(1.4);
                            opacity: 0;
                        }
                        100% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 0;
                        }
                    }
                    
                    /* Prevenir scroll del body cuando el modal está abierto */
                    body.modal-open {
                        overflow: hidden;
                    }
                `}
            </style>
        </>
    );
};

export default WebModal;