// ChatApp.js (Finalizado)
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

  // Handlers de autenticación
  const handleRegister = async (userData) => {
    try {
      const newUser = await register(userData);
      await connectUser(newUser);
      setShowChat(true);
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await login(credentials);
      await connectUser(user);
      setShowChat(true);
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowChat(false);
    setAdminView(ADMIN_VIEWS.CHAT);
  };

  // Handlers de chat
  const handleOpenChat = () => setShowChat(true);
  const handleCloseChat = () => setShowChat(false);

  const handleChannelSelect = async (userName) => {
    try {
      const targetChannel = await findChannelForUser(userName);

      if (targetChannel) {
        await switchChannel(targetChannel);
      } else {
        console.warn('Canal no encontrado para', userName);
      }
    } catch (error) {
      console.error('Error cambiando canal:', error);
    }
  };

  // Estados de carga
  if (isConnecting || authLoading) {
    return <LoadingScreen />;
  }

  // No autenticado - mostrar login/registro
  if (!isAuthenticated) {
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
