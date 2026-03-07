import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

const RestablecerPassword = () => {
    const { showToast, setUsuario } = useOutletContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [loading, setLoading] = useState(false);
    const [exitoso, setExitoso] = useState(false);
    const [tokenValido, setTokenValido] = useState(true);
    const [formData, setFormData] = useState({
        pass_nueva: '',
        pass_nueva_confirmation: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!token || !email) setTokenValido(false);
    }, []);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'pass_nueva') {
            if (value.length > 0 && value.length < 6) error = 'Mínimo 6 caracteres';
            if (value.length > 20) error = 'Máximo 20 caracteres';
        }
        if (name === 'pass_nueva_confirmation') {
            if (value !== formData.pass_nueva) error = 'Las contraseñas no coinciden';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(e => e !== '');
        if (hasErrors) return showToast('Revisa los campos en rojo', 'error');

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/restablecer-password`, {
                email,
                token,
                pass_nueva: formData.pass_nueva,
                pass_nueva_confirmation: formData.pass_nueva_confirmation,
            });
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setUsuario(null); 
            setExitoso(true);
        } catch (error) {
            const msg = error.response?.data?.message || 'El enlace es inválido o ha expirado';
            showToast(msg, 'error');
            if (error.response?.status === 422) setTokenValido(false);
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValido) return (
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px] border border-gray-100 mt-10 p-12">
            <span className="text-6xl mb-6">❌</span>
            <h3 className="text-2xl font-black text-gray-900 text-center">Enlace inválido o expirado</h3>
            <p className="text-gray-400 mt-4 text-center max-w-sm">
                Este enlace no es válido o ha expirado. Solicita uno nuevo desde la página de login.
            </p>
            <button
                onClick={() => navigate('/login')}
                className="mt-8 py-3 px-8 rounded-2xl font-black text-white bg-[#5B7D95] hover:bg-[#4a677a] transition-all"
            >
                Ir al login
            </button>
        </div>
    );

    if (exitoso) return (
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px] border border-gray-100 mt-10 p-12">
            <span className="text-6xl mb-6">✅</span>
            <h3 className="text-2xl font-black text-gray-900 text-center">¡Contraseña restablecida!</h3>
            <p className="text-gray-400 mt-4 text-center max-w-sm">
                Tu contraseña fue actualizada correctamente. Se cerraron todas las sesiones activas por seguridad.
            </p>
            <button
                onClick={() => navigate('/login')}
                className="mt-8 py-3 px-8 rounded-2xl font-black text-white bg-[#2BB1D3] hover:bg-[#1a8da9] transition-all active:scale-95"
            >
                Iniciar sesión
            </button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 mt-10">
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50/50">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 border border-gray-100">
                    <span className="text-5xl">🔐</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Happy Community</h2>
                <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Seguridad y Hogar</p>
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 max-w-xs text-center">
                    <p className="text-sm text-[#5B7D95] font-medium">
                        Elige una contraseña segura de al menos 6 caracteres.
                    </p>
                </div>
            </div>

            <div className="flex-1 p-12 flex flex-col justify-center bg-white">
                <div className="mb-10">
                    <h3 className="text-4xl font-black text-gray-900 leading-tight">Nueva contraseña</h3>
                    <p className="text-gray-400 mt-2 font-medium">Restablece el acceso a tu cuenta.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {['pass_nueva', 'pass_nueva_confirmation'].map((field) => (
                        <div key={field} className="flex flex-col space-y-1">
                            <input
                                name={field}
                                type="password"
                                placeholder={field === 'pass_nueva' ? 'Nueva contraseña' : 'Confirmar contraseña'}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`w-full py-2 border-b-2 outline-none transition-colors bg-transparent ${errors[field] ? 'border-red-500' : 'border-gray-100 focus:border-[#2BB1D3]'
                                    }`}
                            />
                            {errors[field] && (
                                <span className="text-[10px] text-red-500 font-bold animate-pulse">
                                    {errors[field]}
                                </span>
                            )}
                        </div>
                    ))}

                    <button
                        disabled={loading || Object.values(errors).some(e => e !== '')}
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 mt-4 ${loading ? 'bg-gray-300' : 'bg-[#2BB1D3] hover:bg-[#1a8da9]'
                            }`}
                    >
                        {loading ? 'GUARDANDO...' : 'RESTABLECER CONTRASEÑA'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestablecerPassword;