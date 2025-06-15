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
    console.log('🎨 Sidebar renderizado para:', currentUser?.username);

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
                    <div>
                        {console.log('🎨 Renderizando ChannelList - Stream Chat manejará los clics directamente')}
                        
                        {/* ChannelList sin onSelect personalizado - Stream Chat maneja todo */}
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