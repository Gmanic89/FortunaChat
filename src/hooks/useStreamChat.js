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

            // Estrategia simplificada: solo crear canal cuando sea necesario
            if (user.username === 'admin' || user.role === 'admin') {
                console.log('Admin conectado - buscando canales existentes');
                
                // Buscar canales donde admin es miembro
                try {
                    const channels = await client.queryChannels(
                        { 
                            type: 'messaging',
                            members: { $in: [user.username] }
                        },
                        { last_message_at: -1 },
                        { limit: 1 }
                    );
                    
                    if (channels.length > 0) {
                        console.log('✅ Canal encontrado para admin:', channels[0].id);
                        setChannel(channels[0]);
                    } else {
                        console.log('🔍 No hay canales aún, admin esperando...');
                        // No establecer canal, el admin esperará a que los usuarios escriban
                        setChannel(null);
                    }
                } catch (error) {
                    console.log('Error buscando canales para admin, creando uno temporal');
                    setChannel(null);
                }
            } else {
                console.log('Configurando usuario - creando canal con admin');
                // Para usuarios: crear canal directo con admin
                const channelId = ['admin', user.username].sort().join('-');
                const userChannel = client.channel('messaging', channelId, {
                    name: `Chat con admin`,
                    members: ['admin', user.username],
                });

                try {
                    await userChannel.create();
                    setChannel(userChannel);
                    console.log('✅ Canal usuario-admin creado exitosamente:', channelId);
                } catch (error) {
                    console.log('Canal ya existe, conectando...');
                    await userChannel.watch();
                    setChannel(userChannel);
                }
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
            console.log('🔧 switchChannel ejecutado');
            console.log('📥 Nuevo canal recibido:', newChannel?.id);
            console.log('📋 Estado actual - chatClient:', !!chatClient);
            console.log('📋 Estado actual - channel actual:', channel?.id);
            
            if (!chatClient || !newChannel) {
                console.error('❌ Cliente o canal no disponible para cambiar');
                console.error('❌ chatClient exists:', !!chatClient);
                console.error('❌ newChannel exists:', !!newChannel);
                return;
            }
            
            try {
                console.log('🔄 Iniciando cambio de canal a:', newChannel.id);
                
                // Parar de mirar el canal actual
                if (channel && channel.id !== newChannel.id) {
                    console.log('⏹️ Dejando de mirar canal anterior:', channel.id);
                    await channel.stopWatching();
                    console.log('✅ stopWatching completado');
                }
                
                // Empezar a mirar el nuevo canal
                if (!newChannel.initialized) {
                    console.log('🔍 Canal no inicializado, haciendo watch...');
                    await newChannel.watch();
                    console.log('✅ watch completado');
                } else {
                    console.log('✅ Canal ya inicializado');
                }
                
                console.log('📝 Estableciendo nuevo canal en estado...');
                setChannel(newChannel);
                console.log('✅ Canal cambiado exitosamente a:', newChannel.id);
            } catch (error) {
                console.error('❌ Error cambiando canal:', error);
                console.error('❌ Error stack:', error.stack);
            }
        },
        [chatClient, channel]
    );

    // Buscar canal para chatear con otro usuario
    const findChannelForUser = useCallback(
        async (otherUsername) => {
            if (!chatClient || !currentUser) {
                console.error('Cliente no disponible o usuario no autenticado');
                return null;
            }
            
            try {
                console.log(`🔍 Buscando canal existente con ${otherUsername}`);
                
                // PRIMERO: Buscar canales existentes donde ambos usuarios son miembros
                const filters = {
                    type: 'messaging',
                    members: { $in: [otherUsername] }, // Buscar canales que contengan al otro usuario
                };
                
                const sort = { last_message_at: -1 }; // Ordenar por último mensaje
                const channels = await chatClient.queryChannels(filters, sort, { limit: 10 });
                
                console.log(`📋 Encontrados ${channels.length} canales con ${otherUsername}`);
                
                // Buscar un canal que tenga exactamente los dos usuarios
                for (const channel of channels) {
                    const memberIds = Object.keys(channel.state.members || {});
                    console.log(`🔍 Canal ${channel.id} tiene miembros:`, memberIds);
                    
                    // Verificar si es un canal directo entre los dos usuarios
                    if (memberIds.includes(currentUser.username) && 
                        memberIds.includes(otherUsername) &&
                        memberIds.length <= 2) {
                        console.log(`✅ Canal existente encontrado: ${channel.id}`);
                        return channel;
                    }
                }
                
                // Si no se encontró ningún canal existente, crear uno nuevo
                console.log(`📝 No se encontró canal existente, creando uno nuevo`);
                const channelId = [currentUser.username, otherUsername].sort().join('-');
                
                const newChannel = chatClient.channel('messaging', channelId, {
                    members: [currentUser.username, otherUsername],
                    name: `Chat con ${otherUsername}`,
                });

                await newChannel.create();
                console.log('✅ Canal nuevo creado:', channelId);
                return newChannel;
                
            } catch (error) {
                console.error('❌ Error encontrando/creando canal:', error);
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