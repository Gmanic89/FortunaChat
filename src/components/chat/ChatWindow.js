// components/chat/ChatWindow.js
import React from 'react';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
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
    if (!channel) {
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

    // Si es admin, mostrar vista completa con sidebar
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Chat client={chatClient} theme="str-chat__theme-light">
                <div style={{ display: 'flex', height: '100vh' }}>
                    <Sidebar
                        currentUser={currentUser}
                        isAdmin={isAdmin}
                        adminView={adminView}
                        users={users}
                        onAdminViewChange={onAdminViewChange}
                        onCloseChat={onCloseChat}
                        onLogout={onLogout}
                        onChannelSelect={onChannelSelect}
                    />

                    <div style={{ flex: 1 }}>
                        <Channel channel={channel}>
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageInput />
                            </Window>
                            <Thread />
                        </Channel>
                    </div>
                </div>
            </Chat>
        </div>
    );
};

export default ChatWindow;