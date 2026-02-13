// src/pages/Login.jsx
const Login = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-gray-100">
      {/* Lado Izquierdo: Branding */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50/50">
        <div className="w-48 h-48 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 border border-gray-100">
           <span className="text-6xl text-[#5B7D95]">🏠</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Happy Community</h2>
      </div>

      {/* Divisor Visual de tu mockup */}
      <div className="hidden md:block w-1 bg-[#5B7D95] my-20 rounded-full opacity-30"></div>

      {/* Lado Derecho: Formulario */}
      <div className="flex-1 p-12 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Inicio de sesión</h3>
        
        <form className="space-y-6">
          <div className="border-b-2 border-gray-300 focus-within:border-[#2BB1D3] transition-colors">
            <input type="email" placeholder="Correo..." className="w-full py-2 outline-none bg-transparent" />
          </div>
          <div className="border-b-2 border-gray-300 focus-within:border-[#2BB1D3] transition-colors">
            <input type="password" placeholder="Contraseña..." className="w-full py-2 outline-none bg-transparent" />
          </div>
          
          <button type="button" className="w-full bg-[#2BB1D3] hover:bg-[#249ab8] text-white font-bold py-3 rounded-lg shadow-lg transition-all uppercase tracking-wider">
            Continuar
          </button>
        </form>

        {/* Social Login Mockup */}
        <div className="mt-8 flex justify-center gap-6">
          <button className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">f</button>
          <button className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shadow-md"></button>
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-md text-red-500 font-bold font-serif">G</button>
        </div>
      </div>
    </div>
  );
};

export default Login;