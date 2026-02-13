import { useState, useEffect, useRef } from 'react';
import Echo from '../echo';
import axios from 'axios';

function Chat({ showToast }) {
  const [showModal, setShowModal] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentUser] = useState({ id: 1, name: 'Usuario 1' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/messages`).then(res => setMessages(res.data));
    const channel = Echo.channel('chat');
    channel.listen('.message.sent', (e) => {
      setMessages((prev) => [...prev, { ...e, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    });
    return () => channel.stopListening('.message.sent');
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, {
        message: newMessage, username: currentUser.name, user_id: currentUser.id
      });
      setMessages(prev => [...prev, { ...data, timestamp: 'Ahora' }]);
      setNewMessage('');
      showToast('Mensaje enviado con éxito', 'success');
    } catch (error) {
      showToast('Error al conectar con el servidor', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-[75vh]">
      {/* MODAL DE PRIVACIDAD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 bg-[#5B7D95] text-white flex justify-between items-center">
              <h4 className="text-xl font-bold">Aviso Importante</h4>
              <button onClick={() => setShowModal(false)} className="text-3xl leading-none">&times;</button>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 leading-relaxed">Por temas de privacidad, no comparta datos sensibles en este chat comunitario.</p>
              <button onClick={() => setShowModal(false)} className="mt-6 bg-[#2BB1D3] text-white px-10 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Entendido</button>
            </div>
          </div>
        </div>
      )}

      {/* CUERPO DEL CHAT */}
      <div className={`transition-all duration-700 ${showModal ? 'blur-md grayscale-[30%] pointer-events-none' : 'blur-0'}`}>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[75vh]">
          <div className="p-5 bg-[#5B7D95] text-white flex items-center justify-between">
            <span className="font-bold text-lg flex items-center gap-2">💬 Chat Comunitario</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => {
              const isMe = msg.userId === currentUser.id;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${isMe ? 'bg-[#2BB1D3] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
                    {!isMe && <p className="text-[10px] font-bold text-[#5B7D95] uppercase mb-1">{msg.username}</p>}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT CON ESTADO DE CARGA */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-3">
            <input 
              disabled={isSending}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isSending ? "Procesando..." : "Escribe un mensaje..."}
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-[#2BB1D3] outline-none border-none"
            />
            <button 
              disabled={isSending}
              type="submit" 
              className={`px-8 rounded-full text-white font-bold transition-all flex items-center gap-2 ${isSending ? 'bg-gray-400' : 'bg-[#5B7D95] hover:bg-[#4a677a]'}`}
            >
              {isSending ? <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span> : 'Enviar 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;