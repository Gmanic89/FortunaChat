import React, { useState, useEffect, useRef } from 'react';
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
import './ModernChat.css'; // ← AGREGAR ESTA LÍNEA

// Reemplaza con tu API Key real de Stream
const API_KEY = process.env.REACT_APP_STREAM_API_KEY || '7met7m5hgkb8ui';
const chatClient = StreamChat.getInstance(API_KEY);

const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });
  const messagesEndRef = useRef(null);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('chatUsers') || '[]');
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const savedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    setUsers(savedUsers);
    setMessages(savedMessages);
    
    if (savedCurrentUser) {
      setCurrentUser(savedCurrentUser);
      setShowLogin(false);
    }
  }, []);

  // Auto scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Guardar datos en localStorage
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Manejar registro
  const handleRegister = () => {
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (users.find(user => user.username === registerData.username)) {
      alert('El usuario ya existe');
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
    saveToStorage('chatUsers', updatedUsers);
    
    alert('Usuario registrado exitosamente');
    setIsRegistering(false);
    setRegisterData({ username: '', password: '', confirmPassword: '' });
  };

  // Manejar login
  const handleLogin = () => {
    const user = users.find(u => 
      u.username === loginData.username && u.password === loginData.password
    );
    
    if (user) {
      setCurrentUser(user);
      saveToStorage('currentUser', user);
      setShowLogin(false);
      setLoginData({ username: '', password: '' });
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  // Manejar logout
  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setShowChat(false);
    localStorage.removeItem('currentUser');
  };

  // Enviar mensaje
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: currentUser.username,
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      saveToStorage('chatMessages', updatedMessages);
      setNewMessage('');
    }
  };

  // Formatear fecha
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pantalla de Login/Registro
  if (showLogin) {
    return (
      <div className="modern-login-container">
        <div className="modern-login-card">
          <div className="modern-login-header">
            <div className="modern-app-icon">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="modern-app-title">ModernChat</h1>
            <p className="modern-app-subtitle">
              {isRegistering ? 'Crear nueva cuenta' : 'Bienvenido de vuelta'}
            </p>
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
                type="button"
                onClick={handleRegister}
                className="modern-btn-primary"
              >
                <UserPlus className="w-5 h-5" />
                Crear Cuenta
              </button>

              <button
                type="button"
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
                type="button"
                onClick={handleLogin}
                className="modern-btn-primary"
              >
                Iniciar Sesión
              </button>

              <button
                type="button"
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
  if (!showChat) {
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
          <p className="modern-welcome-subtitle">Haz clic en el icono para abrir ModernChat</p>
          <div className="modern-status-indicator">
            <div className="modern-status-dot"></div>
            Sistema conectado
          </div>
          <button
            onClick={handleLogout}
            className="modern-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de chat
  return (
    <div className="modern-chat-container">
      {/* Header del chat */}
      <div className="modern-chat-header">
        <div className="modern-chat-header-left">
          <button
            onClick={() => setShowChat(false)}
            className="modern-header-btn"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <h1 className="modern-chat-title">Chat Global</h1>
        </div>
        <div className="modern-chat-header-right">
          <span className="modern-chat-user-info">
            Conectado como {currentUser.username}
          </span>
          <button
            onClick={handleLogout}
            className="modern-logout-btn"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="modern-messages-area">
        {messages.length === 0 ? (
          <div className="modern-empty-state">
            <MessageCircle className="modern-empty-icon" />
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`modern-message-row ${
                message.sender === currentUser.username ? 'sent' : 'received'
              }`}
            >
              <div
                className={`modern-message-bubble ${
                  message.sender === currentUser.username ? 'sent' : 'received'
                }`}
              >
                {message.sender !== currentUser.username && (
                  <p className="modern-message-sender">{message.sender}</p>
                )}
                <p className="modern-message-text">{message.text}</p>
                <p className={`modern-message-time ${
                  message.sender === currentUser.username ? 'sent' : 'received'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de envío */}
      <div className="modern-input-area">
        <div className="modern-input-container-chat">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className="modern-message-input"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="modern-send-btn"
            disabled={!newMessage.trim()}
          >
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;