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
import { MessageCircle, User, Lock, LogOut, UserPlus, Crown, Users, MessageSquare } from 'lucide-react';

import 'stream-chat-react/dist/css/v2/index.css';
import './ModernChat.css';

// Tu API Key de Stream
const API_KEY = '7met7m5hgkb8';
const chatClient = StreamChat.getInstance(API_KEY);

// Define tu username de admin aquí
const ADMIN_USERNAME = 'admin';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminView, setAdminView] = useState('chat');

  // Cargar usuarios del localStorage
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('fortunaChatUsers') || '[]');
    const savedCurrentUser = JSON.parse(localStorage.getItem('fortunaCurrentUser') || 'null');
    
    setUsers(savedUsers);
    
    if (savedCurrentUser) {
      connectUserToStream(savedCurrentUser);
    }
  }, []);

  // Verificar si es admin
  const checkIfAdmin = (username) => {
    return username === ADMIN_USERNAME;
  };

  // Crear canal privado con admin
  const createPrivateChannelWithAdmin = async (newUsername) => {
    try {
      const channelId = `private-${ADMIN_USERNAME}-${newUsername}`;
      const privateChannel = chatClient.channel('messaging', channelId, {
        name: `Chat con ${newUsername}`,
        members: [ADMIN_USERNAME, newUsername],
        created_by_id: newUsername,
      });
      
      await privateChannel.create();
      
      console.log(`✅ Canal privado creado: ${channelId}`);
      return privateChannel;
    } catch (error) {
      console.error('Error creando canal privado:', error);
      try {
        const channelId = `private-${ADMIN_USERNAME}-${newUsername}`;
        const fallbackChannel = chatClient.channel('messaging', channelId, {
          name: `Chat con ${newUsername}`,
          members: [newUsername],
          created_by_id: newUsername,
        });
        await fallbackChannel.create();
        console.log(`✅ Canal creado, admin se agregará después`);
        return fallbackChannel;
      } catch (fallbackError) {
        console.error('Error en canal fallback:', fallbackError);
        return null;
      }
    }
  };

  // Conectar usuario a Stream Chat
  const connectUserToStream = async (user) => {
    try {
      setIsConnecting(true);
      
      const token = chatClient.devToken(user.username);
      const adminStatus = checkIfAdmin(user.username);
      setIsAdmin(adminStatus);
      
      await chatClient.connectUser(
        {
          id: user.username,
          name: user.username,
          image: `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`,
          role: adminStatus ? 'admin' : 'user',
        },
        token
      );

      let defaultChannel;
      
      if (adminStatus) {
        // Admin: usar canal general (como antes)
        defaultChannel = chatClient.channel('livestream', 'general');
        await defaultChannel.watch();
      } else {
        // Usuario: chat privado con admin
        defaultChannel = await createPrivateChannelWithAdmin(user.username);
        
        if (!defaultChannel) {
          defaultChannel = chatClient.channel('messaging', `waiting-${user.username}`, {
            name: 'Esperando al administrador...',
            members: [user.username],
          });
          await defaultChannel.create();
        }
      }

      setChannel(defaultChannel);
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
      setIsAdmin(false);
      setShowLogin(true);
      setShowChat(false);
      setAdminView('chat');
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
      createdAt: new Date().toISOString(),
      isAdmin: checkIfAdmin(registerData.username)
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('fortunaChatUsers', updatedUsers);
    saveToStorage('fortunaCurrentUser', newUser);
    
    setIsRegistering(false);
    setRegisterData({ username: '', password: '', confirmPassword: '' });
    
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
                {registerData.username === ADMIN_USERNAME && (
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                    👑 Este usuario será administrador
                  </div>
                )}
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
            ¡Hola, {currentUser.username}! {isAdmin && '👑'}
          </h2>
          <p className="modern-welcome-subtitle">
            {isAdmin 
              ? 'Panel de administrador - Gestiona tu FortunaChat' 
              : 'Haz clic en el icono para abrir tu chat privado'
            }
          </p>
          <div className="modern-status-indicator">
            <div className="modern-status-dot"></div>
            {isAdmin ? 'Admin conectado' : 'Conectado a Stream Chat'}
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

  // Chat de Stream
  if (showChat && channel) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Chat client={chatClient} theme="str-chat__theme-light">
          <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
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
                  FortunaChat {isAdmin && '👑'}
                </h2>
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
              
              <div style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                color: '#6b7280',
                borderBottom: '1px solid #f3f4f6'
              }}>
                {isAdmin ? '👑 Administrador' : 'Usuario'}: <strong>{currentUser.username}</strong>
              </div>
              
              {/* Admin Controls */}
              {isAdmin && (
                <div style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => setAdminView('chat')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: adminView === 'chat' ? '#6366f1' : '#f3f4f6',
                      color: adminView === 'chat' ? 'white' : '#6b7280',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    <MessageSquare style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.25rem' }} />
                    Chats
                  </button>
                  <button
                    onClick={() => setAdminView('users')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      background: adminView === 'users' ? '#6366f1' : '#f3f4f6',
                      color: adminView === 'users' ? 'white' : '#6b7280',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    <Users style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.25rem' }} />
                    Usuarios
                  </button>
                </div>
              )}
              
              <div style={{ flex: 1 }}>
                {isAdmin && adminView === 'users' ? (
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                      Usuarios Registrados ({users.filter(u => !checkIfAdmin(u.username)).length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {users.filter(u => !checkIfAdmin(u.username)).map(user => (
                        <div
                          key={user.id}
                          style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            background: 'white'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                              src={`https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff&size=32`}
                              alt={user.username}
                              style={{ width: '2rem', height: '2rem', borderRadius: '50%' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                                {user.username}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={async (e) => {
                      console.log('🔥 Click detectado - iniciando búsqueda...');
                      
                      try {
                        // Múltiples selectores para encontrar el elemento clickeado
                        const channelItem = e.target.closest('[role="button"]') || 
                                          e.target.closest('.str-chat__channel-preview') ||
                                          e.target.closest('[class*="channel"]') ||
                                          e.target.closest('div[style*="cursor"]') ||
                                          e.target;
                        
                        if (!channelItem) {
                          console.log('❌ No se pudo encontrar elemento del canal');
                          return;
                        }
                        
                        console.log('📍 Elemento encontrado:', channelItem);
                        
                        // Obtener todos los canales disponibles CON TIMEOUT
                        console.log('🔍 Obteniendo canales...');
                        const channels = await Promise.race([
                          chatClient.queryChannels(
                            { type: 'messaging', members: { $in: [currentUser.username] } },
                            { last_message_at: -1 },
                            { limit: 20 }
                          ),
                          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                        ]);
                        
                        console.log('📋 Canales obtenidos:', channels.length);
                        
                        // Buscar texto en todo el elemento y sus hijos
                        const getText = (element) => {
                          return element.textContent || element.innerText || '';
                        };
                        
                        const channelText = getText(channelItem);
                        console.log('📝 Texto completo del canal:', channelText);
                        
                        // Múltiples patrones para extraer el nombre
                        let userName = null;
                        
                        // Patrón 1: "Chat con X" (más específico)
                        let match = channelText.match(/Chat con (\w+)/i);
                        if (match) {
                          userName = match[1];
                          console.log('🎯 Usuario extraído con patrón "Chat con":', userName);
                        }
                        
                        // Si no se encontró, usar el aria-label que es más limpio
                        if (!userName) {
                          const ariaLabel = channelItem.getAttribute('aria-label') || '';
                          console.log('🏷️ Aria-label:', ariaLabel);
                          match = ariaLabel.match(/Select Channel: Chat con (\w+)/i);
                          if (match) {
                            userName = match[1];
                            console.log('🎯 Usuario extraído con aria-label:', userName);
                          }
                        }
                        
                        console.log('👤 Usuario extraído:', userName);
                        
                        if (!userName) {
                          console.log('❌ No se pudo extraer nombre de usuario');
                          return;
                        }
                        
                        // Buscar canal por múltiples criterios
                        let targetChannel = null;
                        
                        // Método 1: Por ID exacto
                        const expectedId = `private-${ADMIN_USERNAME}-${userName}`;
                        targetChannel = channels.find(ch => ch.id === expectedId);
                        
                        // Método 2: Por nombre de canal
                        if (!targetChannel) {
                          targetChannel = channels.find(ch => {
                            const name = ch.data?.name || '';
                            return name.toLowerCase().includes(userName.toLowerCase());
                          });
                        }
                        
                        // Método 3: Por miembros
                        if (!targetChannel) {
                          targetChannel = channels.find(ch => {
                            const members = Object.keys(ch.state.members || {});
                            return members.includes(userName) && members.includes(ADMIN_USERNAME);
                          });
                        }
                        
                        // Método 4: Por último mensaje del usuario
                        if (!targetChannel) {
                          targetChannel = channels.find(ch => {
                            const lastMessage = ch.state.messages[ch.state.messages.length - 1];
                            return lastMessage && lastMessage.user?.id === userName;
                          });
                        }
                        
                        if (targetChannel) {
                          console.log('✅ Canal encontrado:', targetChannel.id);
                          console.log('🔄 Cambiando canal...');
                          
                          await targetChannel.watch();
                          setChannel(targetChannel);
                          
                          console.log('🎉 Canal cambiado exitosamente');
                        } else {
                          console.log('❌ Canal no encontrado después de todos los métodos');
                          console.log('🔍 Canales disponibles:', channels.map(ch => ({
                            id: ch.id,
                            name: ch.data?.name,
                            members: Object.keys(ch.state.members || {})
                          })));
                        }
                        
                      } catch (error) {
                        console.error('💥 Error completo:', error);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <ChannelList 
                      filters={{ 
                        type: 'messaging', 
                        members: { $in: [currentUser.username] } 
                      }}
                      sort={{ last_message_at: -1 }}
                      options={{ limit: 10 }}
                    />
                  </div>
                )}
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