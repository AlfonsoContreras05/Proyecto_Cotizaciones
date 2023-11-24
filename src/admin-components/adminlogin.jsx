import React, { useState } from 'react';
import '../css/styleLogin.css';
import image from '../img/pngwing.com12.png';

const LoginAdministrador = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, password }),
      });
  
      if (response.status === 200) {
        // Inicio de sesión exitoso, redirigir al administrador a la vista NavBarAdmin
        window.location.href = '/NavBarAdmin';
      } else {
        // Credenciales incorrectas
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en la solicitud fetch:', error);
      // Puedes manejar el error de manera apropiada, como mostrar un mensaje de error en el formulario.
    }
  };
  

  return (
    <section className="bg-dark">
      <div className="row g-0">
        <div className="col-lg-5 min-vh-100">
          <div className="px-lg-5 pt-lg-4 pb-lg-3 p-4 w-100 mb-auto">
            <img src={image} className="img-fluid" alt="Logo" />
          </div>
          <div className="px-lg-5 py-lg-4 p4 w-100 align-self-center">
            <h1 className="font-weight-bold mb-4">Bienvenido</h1>
            <form className="mb-5" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="exampleInputEmail1" className="form-label font-weight-bold">
                  Usuario
                </label>
                <input
                  type="text"
                  className="form-control bg-dark-x border-0 text-bg-dark"
                  placeholder="Ingresa tu usuario"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="exampleInputPassword1" className="form-label font-weight-bold">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control bg-dark-x border-0 mb-2 text-bg-dark"
                  placeholder="Ingresa tu contraseña"
                  id="exampleInputPassword1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Iniciar sesión como Administrador
              </button>
            </form>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>
        <div className="col-lg-7 d-none d-lg-block">
          <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item img-1 min-vh-100 active"></div>
              <div className="carousel-item img-2 min-vh-100"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginAdministrador;
