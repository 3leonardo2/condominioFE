import { useState } from 'react';
import axios from 'axios';

const Registro = ({ showToast }) => {
  const [formData, setFormData] = useState({
    nombre: '', apellido_p: '', apellido_m: '', celular: '', pass: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Iniciamos transición de carga

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);
      showToast('¡Cuenta creada con éxito!', 'success'); // Alerta con transición
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al registrar';
      showToast(msg, 'error');
    } finally {
      setLoading(false); // Finalizamos carga
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl animate-in fade-in zoom-in">
      <h2 className="text-2xl font-bold text-[#5B7D95] mb-6 text-center">Crear Cuenta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Nombre"
          className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#2BB1D3] outline-none transition-all"
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          required 
        />
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Apellido Paterno"
            className="w-1/2 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#2BB1D3] outline-none"
            onChange={(e) => setFormData({...formData, apellido_p: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña"
            className="w-1/2 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#2BB1D3] outline-none"
            onChange={(e) => setFormData({...formData, pass: e.target.value})}
            required
          />
        </div>

        <button 
          disabled={loading}
          type="submit"
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            loading ? 'bg-gray-400' : 'bg-[#2BB1D3] hover:bg-[#5B7D95]'
          }`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : 'Registrarme'}
        </button>
      </form>
    </div>
  );
};

export default Registro;