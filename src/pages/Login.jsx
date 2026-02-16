// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

const Login = ({ showToast }) => {
  // Estado para alternar entre Login (true) y Registro (false)
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Estado único para el formulario basado en tu modelo relacional
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_p: '',
    celular: '', 
    email: '',
    pass: ''
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, formData);
      showToast(isLogin ? `Bienvenido de nuevo` : '¡Cuenta creada con éxito!', 'success');
      
      if (!isLogin) setIsLogin(true); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Error en la operación';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-gray-100 transition-all duration-700 ease-in-out">
      
      {/* Lado Izquierdo: Branding (Se mantiene estático para dar estabilidad visual) */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50/50">
        <div className="w-40 h-40 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 border border-gray-100 animate-bounce-slow">
           <span className="text-6xl text-[#5B7D95]">🏠</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Happy Community</h2>
        <p className="text-gray-500 mt-2 text-center">Tu hogar, gestionado con un clic.</p>
      </div>

      {/* Lado Derecho: Formulario Dinámico con Transición de Flujo */}
      <div className="flex-1 p-12 flex flex-col justify-center bg-white relative overflow-hidden">
        
        {/* El "key" asegura que toda la sección se re-anime al cambiar de modo */}
        <div 
          key={isLogin ? 'login-view' : 'register-view'} 
          className="animate-in fade-in slide-in-from-right-12 duration-700 ease-out"
        >
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold text-gray-800">
              {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
            </h3>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Identifícate para acceder a tu panel.' : 'Completa tus datos para unirte a la comunidad.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* GRUPO DINÁMICO DE REGISTRO: Se expande o contrae suavemente */}
            <div className={`grid transition-all duration-500 ease-in-out ${
              isLogin ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100 mb-6'
            }`}>
              <div className="overflow-hidden space-y-5">
                <div className="border-b-2 border-gray-100 focus-within:border-[#2BB1D3] transition-all">
                  <input 
                    type="text" 
                    placeholder="Nombre(s)..." 
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required={!isLogin}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 border-b-2 border-gray-100 focus-within:border-[#2BB1D3] transition-all">
                    <input 
                      type="text" 
                      placeholder="Ap. Paterno" 
                      className="w-full py-2 outline-none bg-transparent"
                      onChange={(e) => setFormData({...formData, apellido_p: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
                  <div className="flex-1 border-b-2 border-gray-100 focus-within:border-[#2BB1D3] transition-all">
                    <input 
                      type="text" 
                      placeholder="Celular" 
                      className="w-full py-2 outline-none bg-transparent"
                      onChange={(e) => setFormData({...formData, celular: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CAMPOS COMUNES (Email y Password) */}
            <div className="space-y-5">
              <div className="border-b-2 border-gray-100 focus-within:border-[#2BB1D3] transition-all">
                <input 
                  type="email" 
                  placeholder="Correo electrónico..." 
                  className="w-full py-2 outline-none bg-transparent" 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="border-b-2 border-gray-100 focus-within:border-[#2BB1D3] transition-all">
                <input 
                  type="password" 
                  placeholder="Contraseña..." 
                  className="w-full py-2 outline-none bg-transparent" 
                  onChange={(e) => setFormData({...formData, pass: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <button 
              disabled={loading}
              type="submit" 
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 ${
                loading ? 'bg-gray-400' : 'bg-[#2BB1D3] hover:bg-[#5B7D95]'
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              ) : (
                isLogin ? 'Ingresar' : 'Registrar Cuenta'
              )}
            </button>
          </form>

          {/* Botón de Intercambio (Toggle) */}
          <div className="mt-10 text-center border-t border-gray-50 pt-6">
            <button 
              onClick={handleToggle}
              className="group text-gray-500 text-sm font-medium transition-all"
            >
              {isLogin ? '¿Aún no tienes cuenta? ' : '¿Ya eres miembro? '}
              <span className="text-[#2BB1D3] font-bold group-hover:underline">
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;