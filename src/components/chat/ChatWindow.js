// components/chat/ChatWindow.js
import React from 'react';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window, ChannelList } from 'stream-chat-react';
import Sidebar from './Sidebar';
import SimpleUserChat from './SimpleUserChat';

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
    console.log('🏠 ChatWindow renderizado con:', {
        hasClient: !!chatClient,
        hasChannel: !!channel,
        channelId: channel?.id,
        currentUser: currentUser?.username,
        isAdmin
    });

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
            <SimpleUserChat
                chatClient={chatClient}
                channel={channel}
                currentUser={currentUser}
                onCloseChat={onCloseChat}
                onLogout={onLogout}
            />
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
                                <ChannelHeader />
                                <MessageList />
                                <MessageInput />
                            </Window>
                            <Thread />
                        </Channel>
                    </div>
                </div>
            </div>
        </Chat>
    );
};

export default ChatWindow;