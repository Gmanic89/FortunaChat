import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  LoadingIndicator,
} from 'stream-chat-react';
import { MessageCircle, User, Lock, LogOut, UserPlus } from 'lucide-react';

import 'stream-chat-react/dist/css/v2/index.css';
import './ModernChat.css';

// Tu API Key de Stream
const API_KEY = '7met7m5hgkb8';
const chatClient = StreamChat.getInstance(API_KEY);

const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [channel, setChannel] = useState(null);

  // Cargar usuarios del localStorage
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('fortunaChatUsers') || '[]');
    const savedCurrentUser = JSON.parse(localStorage.getItem('fortunaCurrentUser') || 'null');
    
    setUsers(savedUsers);
    
    if (savedCurrentUser) {
      connectUserToStream(savedCurrentUser);
    }
  }, []);

  // Conectar usuario a Stream Chat
  const connectUserToStream = async (user) => {
    try {
      setIsConnecting(true);
      
      // Token de desarrollo (para producción necesitas backend)
      const token = chatClient.devToken(user.username);
      
      await chatClient.connectUser(
        {
          id: user.username,
          name: user.username,
          image: `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`,
        },
        token
      );

      // Crear o obtener el canal general
      const generalChannel = chatClient.channel('team', 'general', {
        name: 'Chat General - Fortuna',
        members: [user.username],
        permissions: {
          '*': ['read', 'write', 'create'],
        },
      });

      await generalChannel.create();
      setChannel(generalChannel);
      setCurrentUser(user);
      setShowLogin(false);
      setIsConnecting(false);
      
      console.log('✅ Conectado a Stream Chat exitosamente');
    } catch (error) {
      console.error('❌ Error conectando a Stream:', error);
      setIsConnecting(false);
      alert('Error conectando al chat: ' + error.message);
    }
  };

  // Desconectar usuario
  const disconnectUser = async () => {
    try {
      await chatClient.disconnectUser();
      setCurrentUser(null);
      setChannel(null);
      setShowLogin(true);
      setShowChat(false);
      localStorage.removeItem('fortunaCurrentUser');
    } catch (error) {
      console.error('Error desconectando:', error);
    }
  };

  // Guardar en localStorage
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Manejar registro
  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (users.find(user => user.username === registerData.username)) {
      alert('El usuario ya existe');
      return;
    }
    
    if (registerData.username.length < 3) {
      alert('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }
    
    const newUser = {
      id: Date.now(),
      username: registerData.username,
      password: registerData.password,
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('fortunaChatUsers', updatedUsers);
    saveToStorage('fortunaCurrentUser', newUser);
    
    setIsRegistering(false);
    setRegisterData({ username: '', password: '', confirmPassword: '' });
    
    // Conectar automáticamente después del registro
    await connectUserToStream(newUser);
  };

  // Manejar login
  const handleLogin = async () => {
    const user = users.find(u => 
      u.username === loginData.username && u.password === loginData.password
    );
    
    if (user) {
      saveToStorage('fortunaCurrentUser', user);
      setLoginData({ username: '', password: '' });
      await connectUserToStream(user);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  // Pantalla de carga
  if (isConnecting) {
    return (
      <div className="modern-login-container">
        <div className="modern-login-card">
          <div className="modern-login-header">
            <div className="modern-app-icon">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="modern-app-title">FortunaChat</h1>
            <p className="modern-app-subtitle">Conectando a Stream Chat...</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <LoadingIndicator size={60} />
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Login/Registro
  if (showLogin) {
    return (
      <div className="modern-login-container">
        <div className="modern-login-card">
          <div className="modern-login-header">
            <div className="modern-app-icon">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="modern-app-title">FortunaChat</h1>
            <p className="modern-app-subtitle">
              {isRegistering ? 'Crear nueva cuenta' : 'Bienvenido de vuelta'}
            </p>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#10b981', 
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              Powered by Stream Chat
            </div>
          </div>

          {isRegistering ? (
            <div className="modern-form">
              <div className="modern-input-group">
                <label className="modern-input-label">Usuario</label>
                <div className="modern-input-container">
                  <User className="modern-input-icon" />
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    className="modern-input"
                    placeholder="Tu nombre de usuario"
                    required
                    minLength={3}
                  />
                </div>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">Contraseña</label>
                <div className="modern-input-container">
                  <Lock className="modern-input-icon" />
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="modern-input"
                    placeholder="Crea una contraseña"
                    required
                  />
                </div>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">Confirmar Contraseña</label>
                <div className="modern-input-container">
                  <Lock className="modern-input-icon" />
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    className="modern-input"
                    placeholder="Confirma tu contraseña"
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="modern-btn-primary"
              >
                <UserPlus className="w-5 h-5" />
                Crear Cuenta
              </button>

              <button
                onClick={() => setIsRegistering(false)}
                className="modern-btn-secondary"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          ) : (
            <div className="modern-form">
              <div className="modern-input-group">
                <label className="modern-input-label">Usuario</label>
                <div className="modern-input-container">
                  <User className="modern-input-icon" />
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="modern-input"
                    placeholder="Tu nombre de usuario"
                    required
                  />
                </div>
              </div>

              <div className="modern-input-group">
                <label className="modern-input-label">Contraseña</label>
                <div className="modern-input-container">
                  <Lock className="modern-input-icon" />
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="modern-input"
                    placeholder="Tu contraseña"
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="modern-btn-primary"
              >
                Iniciar Sesión
              </button>

              <button
                onClick={() => setIsRegistering(true)}
                className="modern-btn-secondary"
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pantalla principal con icono de chat
  if (!showChat && currentUser) {
    return (
      <div className="modern-main-screen">
        <div className="modern-main-content">
          <div className="modern-chat-icon-wrapper">
            <button
              onClick={() => setShowChat(true)}
              className="modern-chat-icon-btn"
            >
              <MessageCircle className="w-16 h-16" />
            </button>
          </div>
          <h2 className="modern-welcome-title">
            ¡Hola, {currentUser.username}!
          </h2>
          <p className="modern-welcome-subtitle">Haz clic en el icono para abrir FortunaChat</p>
          <div className="modern-status-indicator">
            <div className="modern-status-dot"></div>
            Conectado a Stream Chat
          </div>
          <button
            onClick={disconnectUser}
            className="modern-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            Desconectar
          </button>
        </div>
      </div>
    );
  }

  // Chat de Stream (AQUÍ ESTÁ EL CHAT REAL)
  if (showChat && channel) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Chat client={chatClient} theme="str-chat__theme-light">
          <div style={{ display: 'flex', height: '100vh' }}>
            {/* Lista de canales (sidebar) */}
            <div style={{ 
              width: '320px', 
              background: 'white', 
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                padding: '1rem 1.5rem', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  FortunaChat
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setShowChat(false)}
                    style={{
                      padding: '0.5rem',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    <MessageCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                </div>
              </div>
              
              <div style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                color: '#6b7280',
                borderBottom: '1px solid #f3f4f6'
              }}>
                Conectado como: <strong>{currentUser.username}</strong>
              </div>
              
              <div style={{ flex: 1 }}>
                <ChannelList 
                  filters={{ type: 'messaging', members: { $in: [currentUser.username] } }}
                  sort={{ last_message_at: -1 }}
                  options={{ limit: 10 }}
                />
              </div>
              
              <div style={{ 
                padding: '1rem', 
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb'
              }}>
                <button
                  onClick={disconnectUser}
                  className="modern-logout-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LogOut style={{ width: '1rem', height: '1rem' }} />
                  Desconectar
                </button>
              </div>
            </div>

            {/* Área de chat principal - AQUÍ VES STREAM CHAT REAL */}
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
  }

  return null;
};

export default ChatApp;