// hooks/useStreamChat.js
import { useState, useEffect, useCallback } from 'react';
import { StreamChat } from 'stream-chat';

export const ADMIN_VIEWS = {
    CHAT: 'CHAT',
    USERS: 'USERS',
};

export const useStreamChat = (currentUser) => {
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    // Solo inicializar el cliente cuando hay currentUser, pero NO conectar automáticamente
    useEffect(() => {
        if (currentUser?.username) {
            // Solo crear la instancia del cliente
            const client = StreamChat.getInstance('7met7m5hgkb8');
            setChatClient(client);
            setIsAdmin(currentUser.username === 'admin' || currentUser.role === 'admin');
        }

        // Cleanup: desconectar usuario cuando cambie o se desmonte
        return () => {
            if (chatClient) {
                chatClient.disconnectUser().catch(console.error);
                setChatClient(null);
                setChannel(null);
            }
        };
    }, [currentUser]);

    // Conectar usuario (función expuesta para usar en ChatApp)
    const connectUser = useCallback(async (user) => {
        if (!user?.username || !user?.token) {
            console.error('Usuario o token faltante:', user);
            return;
        }

        if (!chatClient) {
            console.error('Cliente de chat no inicializado');
            return;
        }

        setIsConnecting(true);
        try {
            // Verificar si ya está conectado
            if (chatClient.user && chatClient.user.id === user.username) {
                console.log('Usuario ya conectado:', user.username);
                setIsConnecting(false);
                return;
            }

            // Desconectar usuario previo si existe
            if (chatClient.user) {
                console.log('Desconectando usuario previo:', chatClient.user.id);
                await chatClient.disconnectUser();
            }
            
            console.log('Conectando usuario:', user.username);
            await chatClient.connectUser(
                { 
                    id: user.username, 
                    name: user.name || user.username,
                    username: user.username,
                },
                user.token
            );

            // Crear/obtener canal general
            const generalChannel = chatClient.channel('messaging', 'general', {
                name: 'General',
                members: [user.username],
            });

            await generalChannel.create();
            setChannel(generalChannel);

            console.log('✅ Usuario conectado exitosamente a Stream Chat:', user.username);
        } catch (error) {
            console.error('❌ Error conectando usuario a Stream:', error);
            throw error;
        } finally {
            setIsConnecting(false);
        }
    }, [chatClient]);

    // Cambiar canal activo
    const switchChannel = useCallback(
        async (newChannel) => {
            if (!chatClient || !newChannel) return;
            
            try {
                if (channel) {
                    await channel.stopWatching();
                }
                
                await newChannel.watch();
                setChannel(newChannel);
                
                console.log('Cambiado a canal:', newChannel.id);
            } catch (error) {
                console.error('Error cambiando canal:', error);
            }
        },
        [chatClient, channel]
    );

    // Buscar canal para chatear con otro usuario
    const findChannelForUser = useCallback(
        async (otherUsername) => {
            if (!chatClient || !currentUser) return null;
            
            try {
                // Buscar canal existente
                const filters = {
                    type: 'messaging',
                    members: { $all: [currentUser.username, otherUsername] },
                };
                const channels = await chatClient.queryChannels(filters, {}, { limit: 1 });
                
                if (channels.length) return channels[0];
                
                // Crear canal si no existe
                const channelId = [currentUser.username, otherUsername].sort().join('-');
                const newChannel = chatClient.channel('messaging', channelId, {
                    members: [currentUser.username, otherUsername],
                    name: `Chat con ${otherUsername}`,
                });
                
                await newChannel.create();
                return newChannel;
            } catch (error) {
                console.error('Error encontrando canal:', error);
                return null;
            }
        },
        [chatClient, currentUser]
    );

    return {
        chatClient,
        channel,
        isAdmin,
        isConnecting,
        connectUser,
        setChannel,
        switchChannel,
        findChannelForUser,
    };
};