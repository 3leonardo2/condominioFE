import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Chat from './components/Chat';
import ActivarCuenta from './pages/ActivarCuenta';
import Admin from './pages/Admin';


function App() {
  return (
    <Router>
      <Routes>
        {/* Definimos MainLayout como la ruta PADRE */}
        <Route path="/" element={<MainLayout />}>
          {/* Todas estas son rutas HIJAS que se verán donde pongas el <Outlet /> */}
          <Route index element={<Inicio />} />
          <Route path="login" element={<Login />} />
          <Route path="chat" element={<Chat />} />
          <Route path="activar-cuenta" element={<ActivarCuenta />} />
          <Route path="admin" element={<Admin />} />
          <Route path="caseta" element={<div className="text-2xl font-bold">Caseta</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;