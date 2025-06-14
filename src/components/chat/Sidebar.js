// components/chat/Sidebar.js
import React from 'react';
import { MessageCircle, LogOut } from 'lucide-react';
import { ChannelList } from 'stream-chat-react';
import AdminPanel from './AdminPanel';
import UserList from './UserList';
import { ADMIN_VIEWS } from '../../utils/constants';

const Sidebar = ({
    currentUser,
    isAdmin,
    adminView,
    users,
    onAdminViewChange,
    onCloseChat,
    onLogout,
    onChannelSelect
}) => {
    const handleChannelClick = async (event) => {
        console.log('🔥 Click detectado - iniciando búsqueda...');

        try {
            const channelItem = event.target.closest('[role="button"]') ||
                event.target.closest('.str-chat__channel-preview') ||
                event.target.closest('[class*="channel"]') ||
                event.target.closest('div[style*="cursor"]') ||
                event.target;

            if (!channelItem) {
                console.log('❌ No se pudo encontrar elemento del canal');
                return;
            }

            console.log('📍 Elemento encontrado:', channelItem);

            // Extraer nombre de usuario del elemento
            const getText = (element) => element.textContent || element.innerText || '';
            const channelText = getText(channelItem);
            console.log('📝 Texto completo del canal:', channelText);

            let userName = null;

            // Usar aria-label primero
            const ariaLabel = channelItem.getAttribute('aria-label') || '';
            console.log('🏷️ Aria-label:', ariaLabel);
            let match = ariaLabel.match(/Select Channel: Chat con (\w+)/i);
            if (match) {
                userName = match[1];
                console.log('🎯 Usuario extraído con aria-label:', userName);
            }

            // Fallback con regex
            if (!userName) {
                match = channelText.match(/Chat con (\w+?)(?:\s|$)/i);
                if (match) {
                    userName = match[1];
                    console.log('🎯 Usuario extraído con patrón estricto:', userName);
                }
            }

            if (userName && onChannelSelect) {
                await onChannelSelect(userName);
            }

        } catch (error) {
            console.error('💥 Error completo:', error);
        }
    };

    return (
        <div style={{
            width: '320px',
            background: 'white',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    FortunaChat {isAdmin && '👑'}
                </h2>
                <button
                    onClick={onCloseChat}
                    style={{
                        padding: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        color: '#6b7280'
                    }}
                >
                    <MessageCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>
            </div>

            {/* User Info */}
            <div style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                color: '#6b7280',
                borderBottom: '1px solid #f3f4f6'
            }}>
                {isAdmin ? '👑 Administrador' : 'Usuario'}: <strong>{currentUser.username}</strong>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
                <AdminPanel
                    currentView={adminView}
                    onViewChange={onAdminViewChange}
                />
            )}

            {/* Main Content */}
            <div style={{ flex: 1 }}>
                {isAdmin && adminView === ADMIN_VIEWS.USERS ? (
                    <UserList users={users} />
                ) : (
                    <div onClick={handleChannelClick} style={{ cursor: 'pointer' }}>
                        <ChannelList
                            filters={{
                                type: 'messaging',
                                members: { $in: [currentUser.username] }
                            }}
                            sort={{ last_message_at: -1 }}
                            options={{ limit: 10 }}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb'
            }}>
                <button
                    onClick={onLogout}
                    className="modern-logout-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <LogOut style={{ width: '1rem', height: '1rem' }} />
                    Desconectar
                </button>
            </div>
        </div>
    );
};

export default Sidebar;