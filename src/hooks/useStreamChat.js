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
            console.log('Inicializando cliente de Stream para:', currentUser.username);
            // Solo crear la instancia del cliente
            const client = StreamChat.getInstance('7met7m5hgkb8');
            setChatClient(client);
            setIsAdmin(currentUser.username === 'admin' || currentUser.role === 'admin');
        } else {
            console.log('No hay currentUser, limpiando cliente');
            setChatClient(null);
            setChannel(null);
        }

        // Cleanup: desconectar usuario cuando cambie o se desmonte
        return () => {
            if (chatClient && chatClient.user) {
                console.log('Limpiando conexión de Stream Chat');
                chatClient.disconnectUser().catch(console.error);
            }
        };
    }, [currentUser?.username]); // Dependencia más específica

    // Conectar usuario (función expuesta para usar en ChatApp)
    const connectUser = useCallback(async (user) => {
        console.log('connectUser llamado con:', user);
        
        if (!user?.username || !user?.token) {
            console.error('Usuario o token faltante:', user);
            return;
        }

        // Si no hay cliente, crear uno
        let client = chatClient;
        if (!client) {
            console.log('Creando nuevo cliente de Stream');
            client = StreamChat.getInstance('7met7m5hgkb8');
            setChatClient(client);
        }

        setIsConnecting(true);
        try {
            // Verificar si ya está conectado
            if (client.user && client.user.id === user.username) {
                console.log('Usuario ya conectado:', user.username);
                setIsConnecting(false);
                return;
            }

            // Desconectar usuario previo si existe
            if (client.user) {
                console.log('Desconectando usuario previo:', client.user.id);
                await client.disconnectUser();
            }
            
            console.log('Conectando usuario a Stream:', user.username);
            await client.connectUser(
                { 
                    id: user.username, 
                    name: user.name || user.username,
                    username: user.username,
                },
                user.token
            );

            // Crear/obtener canal personal (más simple)
            console.log('Creando canal personal');
            const personalChannelId = `personal-${user.username}`;
            const personalChannel = client.channel('messaging', personalChannelId, {
                name: `Chat de ${user.username}`,
                members: [user.username],
            });

            try {
                await personalChannel.watch();
                setChannel(personalChannel);
                console.log('✅ Canal personal creado exitosamente');
            } catch (error) {
                console.log('Canal ya existe, obteniendo...');
                await personalChannel.query();
                setChannel(personalChannel);
            }

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