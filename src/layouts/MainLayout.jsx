import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Echo from '../echo';

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // Estado para Notificaciones
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estado para Toasts (Alertas con transición)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const menuItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Administrar', path: '/admin' },
    { name: 'Caseta', path: '/caseta' },
    { name: 'Chat', path: '/chat' },
  ];

  // Función para mostrar alertas desde cualquier vista
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    const channel = Echo.channel('chat');
    
    channel.listen('.message.sent', (e) => {
      // Si no estamos en el chat, notificamos
      if (location.pathname !== '/chat') {
        setUnreadCount(prev => prev + 1);
        
        const newNotif = {
          id: Date.now(),
          text: `Mensaje de ${e.username}`,
          preview: e.message.substring(0, 30) + "...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setNotifications(prev => [newNotif, ...prev].slice(0, 5));
        showToast(`Nuevo mensaje en el chat`, 'info');
      }
    });

    return () => channel.stopListening('.message.sent');
  }, [location.pathname]);

  // Limpiar contador al entrar al chat
  useEffect(() => {
    if (location.pathname === '/chat') {
      setUnreadCount(0);
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6] relative overflow-x-hidden">
      
      {/* SISTEMA DE TOASTS (Alerta flotante) */}
      <div className={`fixed bottom-8 right-8 z-[200] transition-all duration-500 transform ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
      }`}>
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-green-600 border-green-400' : 'bg-[#5B7D95] border-blue-400'
        } text-white`}>
          <span className="text-xl">{toast.type === 'success' ? '✅' : '📩'}</span>
          <p className="font-bold text-sm tracking-wide">{toast.message}</p>
        </div>
      </div>

      {/* HEADER */}
      <header className="h-20 bg-[#5B7D95] text-white flex items-center justify-between px-10 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform">
               <span className="text-xl text-[#5B7D95]">🏠</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Happy Community</span>
          </Link>

          {/* CAMPANA DE NOTIFICACIONES */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl hover:bg-white/10 p-2 rounded-full transition-colors relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] text-gray-800 animate-in fade-in zoom-in duration-200 origin-top-left">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-700">Notificaciones</span>
                  <button onClick={() => {setNotifications([]); setUnreadCount(0);}} className="text-[10px] text-blue-500 font-bold uppercase">Limpiar</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">Sin novedades</div>
                  ) : (
                    notifications.map(n => (
                      <Link key={n.id} to="/chat" className="block px-5 py-4 hover:bg-blue-50 border-b border-gray-50 transition-colors">
                        <div className="flex justify-between font-bold text-[#5B7D95] text-sm">
                          <span>{n.text}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{n.preview}</p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`font-semibold hover:text-blue-200 transition-colors ${location.pathname === item.path ? 'border-b-2 border-white pb-1' : ''}`}>
              {item.name}
            </Link>
          ))}
          <Link to="/login" className="bg-[#2BB1D3] hover:bg-[#249ab8] px-6 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95">
            Iniciar Sesión
          </Link>
        </nav>
      </header>

      {/* CONTENIDO CON TRANSICIÓN */}
      <main key={location.pathname} className="flex-1 p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
        {/* Clonamos children para inyectar la función showToast */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { showToast });
          }
          return child;
        })}
      </main>
    </div>
  );
};

export default MainLayout;