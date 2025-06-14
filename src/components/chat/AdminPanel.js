// components/chat/AdminPanel.js
import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { ADMIN_VIEWS } from '../../utils/constants';

const AdminPanel = ({ currentView, onViewChange }) => {
    const buttons = [
        {
            id: ADMIN_VIEWS.CHAT,
            label: 'Chats',
            icon: MessageSquare
        },
        {
            id: ADMIN_VIEWS.USERS,
            label: 'Usuarios',
            icon: Users
        }
    ];

    return (
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            gap: '0.5rem'
        }}>
            {buttons.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => onViewChange(id)}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: currentView === id ? '#6366f1' : '#f3f4f6',
                        color: currentView === id ? 'white' : '#6b7280',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                    }}
                >
                    <Icon style={{ width: '1rem', height: '1rem' }} />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default AdminPanel;