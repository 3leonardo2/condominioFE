import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Hook para obtener el token almacenado
const useAuth = () => {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');
    return { token, user };
};

// Configuración de axios con token
const api = (token) => axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
});

// --- Componente Tab ---
const Tab = ({ label, active, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${
            active
                ? 'border-[#2BB1D3] text-[#2BB1D3]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
        }`}
    >
        <span>{icon}</span> {label}
    </button>
);

// --- Badge de estado ---
const EstadoBadge = ({ estado }) => {
    const estilos = {
        Activo:   'bg-green-100 text-green-700',
        Invitado: 'bg-yellow-100 text-yellow-700',
        Inactivo: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${estilos[estado] || 'bg-gray-100 text-gray-500'}`}>
            {estado}
        </span>
    );
};

// ============================================================
// TAB 1 — Lista de Residentes
// ============================================================
const TabResidentes = ({ token, showToast }) => {
    const [residentes, setResidentes] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarResidentes = async () => {
        try {
            const { data } = await api(token).get('/api/admin/residentes');
            setResidentes(data);
        } catch {
            showToast('Error al cargar residentes', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarResidentes(); }, []);

    const toggleEstado = async (residente) => {
        const endpoint = residente.estado === 'Inactivo'
            ? `/api/admin/residentes/${residente.id}/reactivar`
            : `/api/admin/residentes/${residente.id}/desactivar`;
        try {
            await api(token).patch(endpoint);
            showToast('Estado actualizado correctamente', 'success');
            cargarResidentes();
        } catch {
            showToast('Error al actualizar estado', 'error');
        }
    };

    const reenviarInvitacion = async (email) => {
        try {
            await api(token).post('/api/invite/resend', { email });
            showToast('Invitación reenviada correctamente', 'success');
        } catch (e) {
            showToast(e.response?.data?.message || 'Error al reenviar', 'error');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#2BB1D3] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (residentes.length === 0) return (
        <div className="text-center py-20 text-gray-400">
            <span className="text-5xl block mb-4">👥</span>
            <p className="font-semibold">No hay residentes registrados aún.</p>
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-left">
                        <th className="pb-3 font-semibold pl-2">Nombre</th>
                        <th className="pb-3 font-semibold">Correo</th>
                        <th className="pb-3 font-semibold">Teléfono</th>
                        <th className="pb-3 font-semibold">Departamento</th>
                        <th className="pb-3 font-semibold">Estado</th>
                        <th className="pb-3 font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {residentes.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 pl-2 font-semibold text-gray-800">{r.nombre}</td>
                            <td className="py-4 text-gray-500">{r.email}</td>
                            <td className="py-4 text-gray-500">{r.celular}</td>
                            <td className="py-4 text-gray-500">{r.departamento}</td>
                            <td className="py-4"><EstadoBadge estado={r.estado} /></td>
                            <td className="py-4">
                                <div className="flex gap-2">
                                    {r.estado === 'Invitado' && (
                                        <button
                                            onClick={() => reenviarInvitacion(r.email)}
                                            className="text-xs px-3 py-1 rounded-lg bg-yellow-50 text-yellow-600 font-bold hover:bg-yellow-100 transition-colors"
                                        >
                                            Reenviar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleEstado(r)}
                                        className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                                            r.estado === 'Inactivo'
                                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                : 'bg-red-50 text-red-500 hover:bg-red-100'
                                        }`}
                                    >
                                        {r.estado === 'Inactivo' ? 'Reactivar' : 'Desactivar'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ============================================================
// TAB 2 — Invitar Residente
// ============================================================
const TabInvitar = ({ token, showToast }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '', apellido_p: '', apellido_m: '',
        celular: '', email: '', id_depa: '', id_rol: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const cargarOpciones = async () => {
            try {
                const [depas, rols] = await Promise.all([
                    api(token).get('/api/admin/departamentos'),
                    api(token).get('/api/admin/roles'),
                ]);
                setDepartamentos(depas.data);
                setRoles(rols.data);
            } catch {
                showToast('Error al cargar opciones', 'error');
            }
        };
        cargarOpciones();
    }, []);

    const validateField = (name, value) => {
        let error = '';
        if ((name === 'nombre' || name === 'apellido_p') && /[0-9]/.test(value))
            error = 'No se permiten números';
        if (name === 'celular' && value && !/^\d{10}$/.test(value))
            error = 'Deben ser 10 dígitos';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) error = 'Correo no válido';
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
            await api(token).post('/api/invite', formData);
            setEnviado(true);
        } catch (err) {
            showToast(err.response?.data?.message || 'Error al enviar invitación', 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) => `w-full p-3 bg-gray-50 rounded-xl outline-none transition-all text-sm
        ${errors[field] ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-[#2BB1D3]'}`;

    if (enviado) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl mb-4">📨</span>
            <h4 className="text-2xl font-black text-gray-800">¡Invitación enviada!</h4>
            <p className="text-gray-400 mt-2 max-w-sm">
                Se envió un correo a <strong>{formData.email}</strong> con el link de activación.
            </p>
            <button
                onClick={() => { setEnviado(false); setFormData({ nombre: '', apellido_p: '', apellido_m: '', celular: '', email: '', id_depa: '', id_rol: '' }); }}
                className="mt-6 px-8 py-3 bg-[#2BB1D3] text-white rounded-2xl font-bold hover:bg-[#1a8da9] transition-all"
            >
                Invitar otro residente
            </button>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <input name="nombre" placeholder="Nombre(s) *" value={formData.nombre}
                        onChange={handleChange} className={inputClass('nombre')} required />
                    {errors.nombre && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.nombre}</p>}
                </div>
                <div>
                    <input name="apellido_p" placeholder="Apellido Paterno *" value={formData.apellido_p}
                        onChange={handleChange} className={inputClass('apellido_p')} required />
                    {errors.apellido_p && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.apellido_p}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input name="apellido_m" placeholder="Apellido Materno" value={formData.apellido_m}
                    onChange={handleChange} className={inputClass('apellido_m')} />
                <div>
                    <input name="celular" placeholder="Teléfono (10 dígitos)" value={formData.celular}
                        onChange={handleChange} className={inputClass('celular')} />
                    {errors.celular && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.celular}</p>}
                </div>
            </div>

            <div>
                <input name="email" type="email" placeholder="Correo electrónico *" value={formData.email}
                    onChange={handleChange} className={inputClass('email')} required />
                {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <select name="id_depa" value={formData.id_depa} onChange={handleChange}
                    className={inputClass('id_depa')} required>
                    <option value="">Seleccionar departamento *</option>
                    {departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.depa}</option>
                    ))}
                </select>

                <select name="id_rol" value={formData.id_rol} onChange={handleChange}
                    className={inputClass('id_rol')} required>
                    <option value="">Seleccionar rol *</option>
                    {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.rol}</option>
                    ))}
                </select>
            </div>

            <button
                disabled={loading || Object.values(errors).some(e => e !== '')}
                type="submit"
                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
                    loading ? 'bg-gray-300' : 'bg-[#2BB1D3] hover:bg-[#1a8da9]'
                }`}
            >
                {loading ? 'ENVIANDO INVITACIÓN...' : 'ENVIAR INVITACIÓN 📨'}
            </button>
        </form>
    );
};

// ============================================================
// TAB 3 — Departamentos
// ============================================================
const TabDepartamentos = ({ token, showToast }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api(token).get('/api/admin/departamentos')
            .then(({ data }) => setDepartamentos(data))
            .catch(() => showToast('Error al cargar departamentos', 'error'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#2BB1D3] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {departamentos.map(d => (
                <div key={d.id} className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-2 ${
                    d.moroso ? 'border-red-200' : 'border-gray-100'
                }`}>
                    <div className="flex justify-between items-start">
                        <span className="text-2xl font-black text-[#5B7D95]">{d.depa}</span>
                        {d.moroso && (
                            <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full">
                                Moroso
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Departamento #{d.id}</p>
                </div>
            ))}
        </div>
    );
};

// ============================================================
// COMPONENTE PRINCIPAL — Admin.jsx
// ============================================================
const Admin = () => {
    const { showToast } = useOutletContext();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [tabActivo, setTabActivo] = useState('residentes');

    // Redirigir si no es admin
    useEffect(() => {
        if (!token || !user?.admin) {
            navigate('/login');
        }
    }, []);

    const tabs = [
        { key: 'residentes',    label: 'Residentes',    icon: '👥' },
        { key: 'invitar',       label: 'Invitar',        icon: '📨' },
        { key: 'departamentos', label: 'Departamentos',  icon: '🏢' },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Header del panel */}
            <div className="bg-[#5B7D95] px-8 py-6 text-white">
                <h2 className="text-2xl font-black">Panel de Administración</h2>
                <p className="text-blue-100 text-sm mt-1">Gestiona residentes y departamentos del condominio</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-100 px-6 flex gap-2">
                {tabs.map(tab => (
                    <Tab
                        key={tab.key}
                        label={tab.label}
                        icon={tab.icon}
                        active={tabActivo === tab.key}
                        onClick={() => setTabActivo(tab.key)}
                    />
                ))}
            </div>

            {/* Contenido del tab activo */}
            <div className="p-8">
                {tabActivo === 'residentes' && (
                    <TabResidentes token={token} showToast={showToast} />
                )}
                {tabActivo === 'invitar' && (
                    <TabInvitar token={token} showToast={showToast} />
                )}
                {tabActivo === 'departamentos' && (
                    <TabDepartamentos token={token} showToast={showToast} />
                )}
            </div>
        </div>
    );
};

export default Admin;