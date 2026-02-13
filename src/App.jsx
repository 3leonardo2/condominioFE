// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          {/* Agrega aquí las rutas para Admin y Caseta cuando las crees */}
          <Route path="/admin" element={<div className="text-2xl font-bold">Vista de Administración (Próximamente)</div>} />
          <Route path="/caseta" element={<div className="text-2xl font-bold">Vista de Caseta (Próximamente)</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;