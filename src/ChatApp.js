// ChatApp.js (Con debugging)
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useStreamChat } from './hooks/useStreamChat';
import AuthContainer from './components/auth/AuthContainer';
import LoadingScreen from './components/ui/LoadingScreen';
import WelcomeScreen from './components/ui/WelcomeScreen';
import ChatWindow from './components/chat/ChatWindow';
import { ADMIN_VIEWS } from './utils/constants';

import 'stream-chat-react/dist/css/v2/index.css';
import './ModernChat.css';

const ChatApp = () => {
  // Estados principales
  const [showChat, setShowChat] = useState(false);
  const [adminView, setAdminView] = useState(ADMIN_VIEWS.CHAT);

  // Hooks personalizados de autenticación y chat
  const {
    currentUser,
    users,
    isLoading: authLoading,
    register,
    login,
    logout,
    isAuthenticated,
  } = useAuth();

  const {
    chatClient,
    channel,
    isAdmin,
    isConnecting,
    connectUser,
    findChannelForUser,
    switchChannel,
  } = useStreamChat(currentUser);

  // Conectar automáticamente cuando currentUser cambia (desde localStorage o login)
  React.useEffect(() => {
    const autoConnect = async () => {
      if (currentUser && currentUser.token && !channel && !isConnecting) {
        console.log('🔄 Auto-conectando usuario desde useEffect:', currentUser.username);
        try {
          await connectUser(currentUser);
          console.log('✅ Auto-conexión exitosa');
        } catch (error) {
          console.error('❌ Error en auto-conexión:', error);
        }
      }
    };

    autoConnect();
  }, [currentUser, channel, isConnecting, connectUser]);

  // Debug: logs de estado
  console.log('🔄 ChatApp render:', {
    isAuthenticated,
    currentUser: currentUser?.username,
    showChat,
    hasChannel: !!channel,
    isConnecting,
    authLoading,
  });
  const handleRegister = async (userData) => {
    try {
      console.log('📝 Iniciando registro:', userData.username);
      const newUser = await register(userData);
      console.log('👤 Usuario registrado:', newUser);
      
      await connectUser(newUser);
      console.log('💬 Usuario conectado a Stream');
      
      setShowChat(true);
      console.log('✅ Mostrando chat después del registro');
    } catch (error) {
      console.error('❌ Error en registro:', error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      console.log('🔐 Iniciando login:', credentials.username);
      const user = await login(credentials);
      console.log('👤 Usuario logueado:', user);
      
      await connectUser(user);
      console.log('💬 Usuario conectado a Stream');
      
      setShowChat(true);
      console.log('✅ Mostrando chat después del login');
    } catch (error) {
      console.error('❌ Error en login:', error);
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Iniciando logout');
    await logout();
    setShowChat(false);
    setAdminView(ADMIN_VIEWS.CHAT);
    console.log('✅ Logout completado');
  };

  // Handlers de chat
  const handleOpenChat = async () => {
    console.log('💬 Abriendo chat');
    
    // Si no hay canal pero hay usuario, conectar primero
    if (currentUser && !channel && !isConnecting) {
      console.log('🔄 No hay canal, conectando usuario primero');
      try {
        await connectUser(currentUser);
        console.log('✅ Usuario conectado, ahora abriendo chat');
      } catch (error) {
        console.error('❌ Error conectando usuario:', error);
        return;
      }
    }
    
    setShowChat(true);
  };
  
  const handleCloseChat = () => {
    console.log('❌ Cerrando chat');
    setShowChat(false);
  };

  const handleChannelSelect = async (channelOrUserName) => {
    console.log('🎯 handleChannelSelect en ChatApp ejecutado');
    console.log('📥 Recibido:', channelOrUserName);
    console.log('📥 Tipo:', typeof channelOrUserName);
    
    try {
      // Si recibimos un objeto canal directamente (desde ChannelList)
      if (channelOrUserName && typeof channelOrUserName === 'object' && channelOrUserName.id) {
        console.log('📞 Canal recibido directamente:', channelOrUserName.id);
        console.log('🔧 switchChannel function exists:', !!switchChannel);
        
        if (switchChannel) {
          console.log('🔄 Llamando a switchChannel...');
          await switchChannel(channelOrUserName);
          console.log('✅ switchChannel completado');
        } else {
          console.error('❌ switchChannel no está definido');
        }
        return;
      }
      
      // Si recibimos un string (nombre de usuario) - búsqueda de canal
      if (typeof channelOrUserName === 'string') {
        console.log('📞 Seleccionando canal para usuario:', channelOrUserName);
        console.log('🔧 findChannelForUser function exists:', !!findChannelForUser);
        
        const targetChannel = await findChannelForUser(channelOrUserName);
        console.log('🎯 Canal encontrado:', targetChannel?.id);

        if (targetChannel && switchChannel) {
          await switchChannel(targetChannel);
          console.log('✅ Canal cambiado exitosamente');
        } else {
          console.warn('⚠️ Canal no encontrado para', channelOrUserName);
        }
      }
    } catch (error) {
      console.error('❌ Error cambiando canal:', error);
      console.error('❌ Error completo:', error.stack);
    }
  };

  // Estados de carga
  if (isConnecting || authLoading) {
    console.log('⏳ Mostrando pantalla de carga');
    return <LoadingScreen />;
  }

  // No autenticado - mostrar login/registro
  if (!isAuthenticated) {
    console.log('🔒 Usuario no autenticado, mostrando AuthContainer');
    return (
      <AuthContainer
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={authLoading}
      />
    );
  }

  // Mostrar chat
  if (showChat && (channel || (isAuthenticated && currentUser))) {
    console.log('💬 Mostrando ChatWindow');
    return (
      <ChatWindow
        chatClient={chatClient}
        channel={channel}
        currentUser={currentUser}
        isAdmin={isAdmin}
        adminView={adminView}
        users={users}
        onAdminViewChange={setAdminView}
        onCloseChat={handleCloseChat}
        onLogout={handleLogout}
        onChannelSelect={handleChannelSelect}
      />
    );
  }

  // Pantalla de bienvenida
  console.log('🏠 Mostrando WelcomeScreen', { 
    showChat, 
    hasChannel: !!channel,
    reason: !showChat ? 'showChat es false' : 'no hay canal'
  });
  
  return (
    <WelcomeScreen
      currentUser={currentUser}
      isAdmin={isAdmin}
      onOpenChat={handleOpenChat}
      onLogout={handleLogout}
    />
  );
};

export default ChatApp;