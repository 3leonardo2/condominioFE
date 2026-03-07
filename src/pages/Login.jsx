import { useState } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';



const InputField = ({ name, type, placeholder, value, onChange, error }) => (
    <div className="flex flex-col space-y-1 w-full">
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full py-2 border-b-2 outline-none transition-colors bg-transparent ${error ? 'border-red-500' : 'border-gray-100 focus:border-[#2BB1D3]'
                }`}
        />
        {error && (
            <span className="text-[10px] text-red-500 font-bold animate-pulse">{error}</span>
        )}
    </div>
);



const Login = () => {
    const { showToast } = useOutletContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ email: '', pass: '' });

    const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
    const [emailRecuperacion, setEmailRecuperacion] = useState('');
    const [loadingRecuperacion, setLoadingRecuperacion] = useState(false);

    // Mostrar mensaje si viene de activar cuenta
    useEffect(() => {
        if (searchParams.get('verified') === '1') {
            showToast('¡Correo verificado! Ya puedes iniciar sesión', 'success');
        }
    }, []);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.length > 0 && !emailRegex.test(value)) error = 'Correo no válido';
        }
        if (name === 'pass') {
            if (value.length > 0 && value.length < 6) error = 'Mínimo 6 caracteres';
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
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/login`,
                {
                    ...formData,
                    dispositivo: `${navigator.platform} - ${navigator.userAgent.split(')')[0].split('(')[1]}`
                }

            );

            // Guardar token y datos del usuario
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify(data.user));

            showToast(`¡Bienvenido!`, 'success');

            // Redirigir según rol
            if (data.user.admin) {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'Error de conexión';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRecuperacion = async (e) => {
        e.preventDefault();
        setLoadingRecuperacion(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/recuperar-password`, {
                email: emailRecuperacion
            });
            showToast('Revisa tu correo para restablecer tu contraseña', 'success');
            setMostrarRecuperacion(false);
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al enviar el correo';
            showToast(msg, 'error');
        } finally {
            setLoadingRecuperacion(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 mt-10">

            {/* Branding */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50/50">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 border border-gray-100">
                    <span className="text-5xl">🏠</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Happy Community</h2>
                <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Seguridad y Hogar</p>
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 max-w-xs text-center">
                    <p className="text-sm text-[#5B7D95] font-medium">
                        El acceso a este sistema es exclusivo para residentes y administradores registrados.
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <div className="flex-1 p-12 flex flex-col justify-center bg-white">
                <div className="mb-10">
                    <h3 className="text-4xl font-black text-gray-900 leading-tight">¡Hola!</h3>
                    <p className="text-gray-400 mt-2 font-medium">Ingresa para gestionar tu comunidad.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputField
                        name="pass"
                        type="password"
                        placeholder="Contraseña"
                        value={formData.pass}
                        onChange={handleChange}
                        error={errors.pass}
                    />

                    <button
                        disabled={loading || Object.values(errors).some(e => e !== '')}
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 mt-4 ${loading ? 'bg-gray-300' : 'bg-[#2BB1D3] hover:bg-[#1a8da9]'
                            }`}
                    >
                        {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                    {mostrarRecuperacion ? (
                        <form onSubmit={handleRecuperacion} className="space-y-4">
                            <p className="text-sm text-gray-500 font-medium">
                                Ingresa tu correo y te enviaremos un link para restablecer tu contraseña.
                            </p>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={emailRecuperacion}
                                onChange={(e) => setEmailRecuperacion(e.target.value)}
                                className="w-full py-2 border-b-2 border-gray-100 focus:border-[#2BB1D3] outline-none transition-colors bg-transparent text-sm"
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMostrarRecuperacion(false)}
                                    className="flex-1 py-2 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={loadingRecuperacion}
                                    type="submit"
                                    className={`flex-1 py-2 rounded-xl font-bold text-white transition-all text-sm ${loadingRecuperacion ? 'bg-gray-300' : 'bg-[#2BB1D3] hover:bg-[#1a8da9]'
                                        }`}
                                >
                                    {loadingRecuperacion ? 'Enviando...' : 'Enviar link'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-400">
                                ¿No tienes acceso? Contacta al administrador de tu condominio.
                            </p>
                            <button
                                onClick={() => setMostrarRecuperacion(true)}
                                className="text-sm font-semibold text-[#2BB1D3] hover:underline transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;