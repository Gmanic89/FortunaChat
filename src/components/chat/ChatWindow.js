// components/chat/ChatWindow.js
import React, { useState, useEffect } from 'react';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window, ChannelList } from 'stream-chat-react';
import { Globe } from 'lucide-react';
import Sidebar from './Sidebar';
import SimpleUserChat from './SimpleUserChat';
import WebModal from '../ui/WebModal';

const ChatWindow = ({
    chatClient,
    channel,
    currentUser,
    isAdmin,
    adminView,
    users,
    onAdminViewChange,
    onCloseChat,
    onLogout,
    onChannelSelect
}) => {
    const [showWebModal, setShowWebModal] = useState(false);

    console.log('🏠 ChatWindow renderizado con:', {
        hasClient: !!chatClient,
        hasChannel: !!channel,
        channelId: channel?.id,
        currentUser: currentUser?.username,
        isAdmin
    });

    // Manejar overflow del body cuando el modal está abierto
    useEffect(() => {
        if (showWebModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        
        // Cleanup al desmontar
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showWebModal]);

    const handleOpenWeb = () => {
        setShowWebModal(true);
    };

    const handleCloseWeb = () => {
        setShowWebModal(false);
    };

    // ❌ SOLO bloquear para usuarios normales sin canal
    if (!channel && !isAdmin) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div>Cargando canal...</div>
            </div>
        );
    }

    // Si es usuario regular (no admin), mostrar vista simple
    if (!isAdmin) {
        return (
            <>
                <SimpleUserChat
                    chatClient={chatClient}
                    channel={channel}
                    currentUser={currentUser}
                    onCloseChat={onCloseChat}
                    onLogout={onLogout}
                    onOpenWeb={handleOpenWeb}
                />
                
                {/* Modal Web también para usuarios */}
                <WebModal 
                    isOpen={showWebModal}
                    onClose={handleCloseWeb}
                    url="https://caipiria.com"
                    title="Caipiria - Plataforma Web"
                />
            </>
        );
    }

    // ✅ Si es admin, mostrar vista completa con sidebar (CON O SIN canal)
    return (
        <Chat client={chatClient} theme="str-chat__theme-light">
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <div style={{ display: 'flex', height: '100vh' }}>
                    {/* ChannelList maneja su propio estado y actualiza automáticamente el canal activo */}
                    <ChannelList
                        filters={{
                            type: 'messaging',
                            members: { $in: [currentUser.username] }
                        }}
                        sort={{ last_message_at: -1 }}
                        options={{ limit: 10 }}
                        List={(props) => (
                            <Sidebar
                                {...props}
                                currentUser={currentUser}
                                isAdmin={isAdmin}
                                adminView={adminView}
                                users={users}
                                onAdminViewChange={onAdminViewChange}
                                onCloseChat={onCloseChat}
                                onLogout={onLogout}
                                onChannelSelect={onChannelSelect}
                            />
                        )}
                    />

                    <div style={{ flex: 1 }}>
                        {/* Channel se actualiza automáticamente cuando se selecciona en ChannelList */}
                        <Channel>
                            <Window>
                                {/* Header personalizado con botón Web */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0 1rem',
                                    background: 'white',
                                    borderBottom: '1px solid #e5e7eb'
                                }}>
                                    <ChannelHeader />
                                    
                                    {/* Botón para abrir modal web */}
                                    <button
                                        onClick={handleOpenWeb}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 4px -1px rgba(99, 102, 241, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-1px)';
                                            e.target.style.boxShadow = '0 4px 8px -2px rgba(99, 102, 241, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 2px 4px -1px rgba(99, 102, 241, 0.3)';
                                        }}
                                        title="Abrir pantalla web"
                                    >
                                        <Globe style={{ width: '1rem', height: '1rem' }} />
                                        Web
                                    </button>
                                </div>
                                
                                <MessageList />
                                <MessageInput />
                            </Window>
                            <Thread />
                        </Channel>
                    </div>
                </div>
            </div>
            
            {/* Modal Web */}
            <WebModal 
                isOpen={showWebModal}
                onClose={handleCloseWeb}
                url="https://caipiria.com"
                title="Caipiria - Plataforma Web"
            />
        </Chat>
    );
};

export default ChatWindow;