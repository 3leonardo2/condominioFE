import { useState, useEffect, useRef } from 'react';
import Echo from '../echo';
import axios from 'axios';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Usuario 1',
    color: '#4CAF50'
  });
  
  const messagesEndRef = useRef(null);

  const users = [
    { id: 1, name: 'Usuario 1', color: '#4CAF50' },
    { id: 2, name: 'Usuario 2', color: '#2196F3' },
    { id: 3, name: 'Usuario 3', color: '#FF9800' },
    { id: 4, name: 'Usuario 4', color: '#E91E63' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

useEffect(() => {
  console.log('Intentando conectar al canal chat...');
  
  const channel = Echo.channel('chat');
  
  console.log('Canal creado:', channel);
  
  channel.listen('.message.sent', (e) => {
    console.log('✅ Mensaje recibido desde WebSocket:', e);
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      username: e.username,
      message: e.message,
      userId: e.userId,
      timestamp: new Date().toLocaleTimeString()
    }]);
  });

  return () => {
    console.log('Desconectando del canal chat');
    Echo.leaveChannel('chat');
  };
}, []);

const sendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  console.log('📤 Enviando mensaje:', {
    message: newMessage,
    username: currentUser.name,
    user_id: currentUser.id
  });

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, {
      message: newMessage,
      username: currentUser.name,
      user_id: currentUser.id
    });
    
    console.log('✅ Respuesta del servidor:', response.data);
    setNewMessage('');
  } catch (error) {
    console.error('❌ Error enviando mensaje:', error);
    alert('Error al enviar mensaje');
  }
};

  const changeUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <div className="chat-app">
      <div className="user-selector">
        <h3>Cambiar Usuario (Solo para pruebas)</h3>
        <div className="user-buttons">
          {users.map(user => (
            <button
              key={user.id}
              className={`user-btn ${currentUser.id === user.id ? 'active' : ''}`}
              style={{ 
                backgroundColor: currentUser.id === user.id ? user.color : '#e0e0e0',
                color: currentUser.id === user.id ? 'white' : 'black'
              }}
              onClick={() => changeUser(user)}
            >
              {user.name}
            </button>
          ))}
        </div>
        <p className="current-user">
          Chateando como: <strong style={{ color: currentUser.color }}>{currentUser.name}</strong>
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h2>💬 Chat en Tiempo Real</h2>
          <span className="online-indicator">● En línea</span>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message ${msg.userId === currentUser.id ? 'own-message' : 'other-message'}`}
              >
                <div className="message-header">
                  <span 
                    className="message-user"
                    style={{ color: users.find(u => u.id === msg.userId)?.color }}
                  >
                    {msg.username}
                  </span>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
                <div className="message-bubble">
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={sendMessage}>
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Enviar 📤
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;