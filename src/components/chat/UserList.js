// components/chat/UserList.js
import React from 'react';
import { streamChatService } from '../../services/streamChat';

const UserList = ({ users }) => {
    const nonAdminUsers = users.filter(u => !streamChatService.checkIfAdmin(u.username));

    return (
        <div style={{ padding: '1rem' }}>
            <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
            }}>
                Usuarios Registrados ({nonAdminUsers.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {nonAdminUsers.map(user => (
                    <div
                        key={user.id}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            background: 'white'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                                src={streamChatService.generateAvatarUrl(user.username)}
                                alt={user.username}
                                style={{ width: '2rem', height: '2rem', borderRadius: '50%' }}
                            />
                            <div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    {user.username}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {nonAdminUsers.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        padding: '2rem 0'
                    }}>
                        No hay usuarios registrados
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;