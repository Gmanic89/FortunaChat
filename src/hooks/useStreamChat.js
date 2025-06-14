// hooks/useStreamChat.js
import { useState, useEffect } from 'react';
import { streamChatService } from '../services/streamChat';

export const useStreamChat = (currentUser) => {
    const [channel, setChannel] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [chatClient] = useState(() => streamChatService.getClient());

    const connectUser = async (user) => {
        try {
            setIsConnecting(true);

            const { isAdmin: adminStatus } = await streamChatService.connectUser(user);
            setIsAdmin(adminStatus);

            const defaultChannel = await streamChatService.getDefaultChannel(user, adminStatus);
            setChannel(defaultChannel);

            console.log('✅ Conectado a Stream Chat exitosamente');
            return { success: true, isAdmin: adminStatus };
        } catch (error) {
            console.error('❌ Error conectando a Stream:', error);
            throw new Error('Error conectando al chat: ' + error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const switchChannel = async (targetChannel) => {
        try {
            await targetChannel.watch();
            setChannel(targetChannel);
        } catch (error) {
            console.error('Error switching channel:', error);
            throw error;
        }
    };

    const findChannelForUser = async (userName) => {
        try {
            const channels = await streamChatService.queryChannels(currentUser.username);

            // Múltiples métodos para encontrar el canal
            const expectedId = `private-${streamChatService.client.user.id}-${userName}`;
            let targetChannel = channels.find(ch => ch.id === expectedId);

            if (!targetChannel) {
                targetChannel = channels.find(ch => {
                    const name = ch.data?.name || '';
                    return name.toLowerCase().includes(userName.toLowerCase());
                });
            }

            if (!targetChannel) {
                targetChannel = channels.find(ch => {
                    const members = Object.keys(ch.state.members || {});
                    return members.includes(userName);
                });
            }

            return targetChannel;
        } catch (error) {
            console.error('Error finding channel:', error);
            return null;
        }
    };

    const disconnect = async () => {
        try {
            await streamChatService.disconnectUser();
            setChannel(null);
            setIsAdmin(false);
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    };

    // Auto-conectar si hay usuario pero no conexión
    useEffect(() => {
        if (currentUser && !channel && !isConnecting) {
            connectUser(currentUser).catch(console.error);
        }
    }, [currentUser, channel, isConnecting]);

    return {
        chatClient,
        channel,
        isAdmin,
        isConnecting,
        connectUser,
        switchChannel,
        findChannelForUser,
        disconnect,
        setChannel
    };
};