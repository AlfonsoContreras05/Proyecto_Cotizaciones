import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginVendedor from './components/loginVendedor.jsx'; 
import './components/styleLogin.css'; // Asegúrate de reemplazar esto con la ruta correcta a tu archivo CSS
import MenuUsuario from './components/MenuUsuario'; 
function App() {
  return (
    <Router>
      <div>
        <Routes> {/* Usa Routes para envolver Route */}
          <Route path="/login-vendedor" element={<LoginVendedor />} />
          <Route path="/Menu-Usuario" element={<MenuUsuario />} />
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
