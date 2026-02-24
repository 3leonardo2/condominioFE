import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const ActivarCuenta = () => {
    const { showToast } = useOutletContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [tokenValido, setTokenValido] = useState(true);
    const [activado, setActivado] = useState(false);
    const [formData, setFormData] = useState({
        pass: '',
        pass_confirmation: ''
    });
    const [errors, setErrors] = useState({});

    // Verificar que el token existe en la URL
    useEffect(() => {
        if (!token) setTokenValido(false);
    }, [token]);

    const validateField = (name, value) => {
        let error = '';

        if (name === 'pass') {
            if (value.length > 0 && value.length < 6) error = 'Mínimo 6 caracteres';
            if (value.length > 20) error = 'Máximo 20 caracteres';
        }

        if (name === 'pass_confirmation') {
            if (value !== formData.pass) error = 'Las contraseñas no coinciden';
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
        if (!formData.pass || !formData.pass_confirmation)
            return showToast('Completa todos los campos', 'error');

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/activate-account`, {
                token,
                pass: formData.pass,
                pass_confirmation: formData.pass_confirmation
            });

            setActivado(true);
        } catch (error) {
            const msg = error.response?.data?.message || 'El enlace es inválido o ha expirado';
            showToast(msg, 'error');
            if (error.response?.status === 422) setTokenValido(false);
        } finally {
            setLoading(false);
        }
    };

    // Token inválido o ausente
    if (!tokenValido) {
        return (
            <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px] border border-gray-100 mt-10 p-12">
                <span className="text-6xl mb-6">❌</span>
                <h3 className="text-2xl font-black text-gray-900 text-center">
                    Enlace inválido o expirado
                </h3>
                <p className="text-gray-400 mt-4 text-center max-w-sm">
                    Este enlace de invitación no es válido o ha expirado. Contacta al administrador para recibir una nueva invitación.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-8 py-3 px-8 rounded-2xl font-black text-white bg-[#5B7D95] hover:bg-[#4a677a] transition-all"
                >
                    Ir al inicio
                </button>
            </div>
        );
    }

    // Cuenta activada con éxito
    if (activado) {
        return (
            <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px] border border-gray-100 mt-10 p-12">
                <span className="text-6xl mb-6">🎉</span>
                <h3 className="text-2xl font-black text-gray-900 text-center">
                    ¡Cuenta activada!
                </h3>
                <p className="text-gray-400 mt-4 text-center max-w-sm">
                    Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión con tu correo y contraseña.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-8 py-3 px-8 rounded-2xl font-black text-white bg-[#2BB1D3] hover:bg-[#1a8da9] transition-all active:scale-95"
                >
                    Ir a iniciar sesión
                </button>
            </div>
        );
    }

    // Formulario de activación
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
                        El administrador te ha invitado a formar parte de la comunidad. Establece tu contraseña para activar tu cuenta.
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <div className="flex-1 p-12 flex flex-col justify-center bg-white">
                <div className="mb-10">
                    <h3 className="text-4xl font-black text-gray-900 leading-tight">
                        Activa tu cuenta
                    </h3>
                    <p className="text-gray-400 mt-2 font-medium">
                        Elige una contraseña segura para continuar.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col space-y-1">
                        <input
                            name="pass"
                            type="password"
                            placeholder="Nueva contraseña"
                            value={formData.pass}
                            onChange={handleChange}
                            className={`w-full py-2 border-b-2 outline-none transition-colors bg-transparent ${
                                errors.pass ? 'border-red-500' : 'border-gray-100 focus:border-[#2BB1D3]'
                            }`}
                        />
                        {errors.pass && (
                            <span className="text-[10px] text-red-500 font-bold animate-pulse">
                                {errors.pass}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <input
                            name="pass_confirmation"
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={formData.pass_confirmation}
                            onChange={handleChange}
                            className={`w-full py-2 border-b-2 outline-none transition-colors bg-transparent ${
                                errors.pass_confirmation ? 'border-red-500' : 'border-gray-100 focus:border-[#2BB1D3]'
                            }`}
                        />
                        {errors.pass_confirmation && (
                            <span className="text-[10px] text-red-500 font-bold animate-pulse">
                                {errors.pass_confirmation}
                            </span>
                        )}
                    </div>

                    <button
                        disabled={loading || Object.values(errors).some(e => e !== '')}
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 mt-4 ${
                            loading ? 'bg-gray-300' : 'bg-[#2BB1D3] hover:bg-[#1a8da9]'
                        }`}
                    >
                        {loading ? 'ACTIVANDO...' : 'ACTIVAR MI CUENTA'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ActivarCuenta;