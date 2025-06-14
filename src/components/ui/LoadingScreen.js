// components/ui/LoadingScreen.js
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { LoadingIndicator } from 'stream-chat-react';

const LoadingScreen = ({ message = "Conectando a Stream Chat..." }) => {
    return (
        <div className="modern-login-container">
            <div className="modern-login-card">
                <div className="modern-login-header">
                    <div className="modern-app-icon">
                        <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="modern-app-title">FortunaChat</h1>
                    <p className="modern-app-subtitle">{message}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <LoadingIndicator size={60} />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;