// src/pages/Inicio.jsx
import imgHorarios from '../assets/horario_imagen.jpg'
import imgFestival from '../assets/festival_imagen.jpg'
import imgLimpieza from '../assets/limpieza_imagen.jpg'
const Inicio = () => {
  const anuncios = [
    { id: 1, titulo: "Horarios modificados", img: imgHorarios, desc: "Seguridad" },
    { id: 2, titulo: "Festival anual (kermés)", img: imgFestival, desc: "Evento" },
    { id: 3, titulo: "Campaña de limpieza", img: imgLimpieza, desc: "Comunidad" },
  ];

  return (
    <div className="space-y-8">
      {/* Banner de Bienvenida */}
      <div className="bg-[#5B7D95] text-white text-center py-4 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold tracking-widest uppercase">¡Bienvenido!</h2>
      </div>

      {/* Carrusel (Demostración Visual) */}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80" 
          alt="Condominio" 
          className="w-full h-full object-cover"
        />
        {/* Indicadores del carrusel de tu mockup */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 p-2 rounded-full">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Sección de Anuncios */}
      <div>
        <h3 className="text-xl font-bold mb-6 ml-2 text-gray-700">Anuncios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:scale-105 transition-transform">
              <img src={anuncio.img} alt={anuncio.titulo} className="w-full h-48 object-cover p-2 rounded-t-3xl" />
              <div className="p-4 text-center">
                <p className="font-semibold text-gray-800">{anuncio.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;