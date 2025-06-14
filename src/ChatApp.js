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

  // Debug: logs de estado
  console.log('🔄 ChatApp render:', {
    isAuthenticated,
    currentUser: currentUser?.username,
    showChat,
    hasChannel: !!channel,
    isConnecting,
    authLoading,
  });

  // Handlers de autenticación
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
  const handleOpenChat = () => {
    console.log('💬 Abriendo chat');
    setShowChat(true);
  };
  
  const handleCloseChat = () => {
    console.log('❌ Cerrando chat');
    setShowChat(false);
  };

  const handleChannelSelect = async (userName) => {
    try {
      console.log('📞 Seleccionando canal para:', userName);
      const targetChannel = await findChannelForUser(userName);

      if (targetChannel) {
        await switchChannel(targetChannel);
        console.log('✅ Canal cambiado exitosamente');
      } else {
        console.warn('⚠️ Canal no encontrado para', userName);
      }
    } catch (error) {
      console.error('❌ Error cambiando canal:', error);
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
  if (showChat && channel) {
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