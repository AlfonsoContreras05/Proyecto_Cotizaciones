import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginVendedor from './components/loginVendedor.jsx'; 
import './components/styleLogin.css'; // Asegúrate de reemplazar esto con la ruta correcta a tu archivo CSS
import MenuUsuario from './components/MenuUsuario'; 
import FormularioCoti from './components/FormularioCoti.jsx'
import NavbarComponent from './components/NavbarComponent.jsx';
import ComponenteProductos  from './components/ComponenteProductos.jsx';
import HistorialVentas from './components/HistorialCotizaciones.jsx';
import Inicio from './components/ComponenteInicio.jsx';
function App() {
  return (
    <Router>
      <div>
        <Routes> {/* Usa Routes para envolver Route */}
          <Route path="/" element={<LoginVendedor />} />
          <Route path="/Menu-Usuario" element={<MenuUsuario />} />
          <Route path="/FormularioCoti" element={<FormularioCoti/>} />
          <Route path="/NavbarComponent" element={<NavbarComponent/>} />
          <Route path="/ComponenteProductos" element={<ComponenteProductos/>} />
          <Route path="/HistorialVentas" element={<HistorialVentas/>} />
          <Route path="/Inicio" element={<Inicio/>} />


          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
