import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Chat from './components/Chat';
import ActivarCuenta from './pages/ActivarCuenta';
import Admin from './pages/Admin';
import RestablecerPassword from './pages/RestablecerPassword';

function App() {
  return (
    <Router>
            <Routes>
              
                <Route path="/" element={<MainLayout />}>

                    {/* Rutas públicas */}
                    <Route index element={<Inicio />} />
                    <Route path="login" element={<Login />} />
                    <Route path="activar-cuenta" element={<ActivarCuenta />} />
                    <Route path="restablecer-password" element={<RestablecerPassword />} />

                    {/* Rutas protegidas — requieren sesión activa */}
                    <Route path="chat" element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    } />

                    {/* Rutas exclusivas de admin */}
                    <Route path="admin" element={
                        <ProtectedRoute requiereAdmin={true}>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="caseta" element={
                        <ProtectedRoute requiereAdmin={true}>
                            <div className="text-2xl font-bold">Caseta</div>
                        </ProtectedRoute>
                    } />

                </Route>
            </Routes>
        </Router>
  );
}

export default App;