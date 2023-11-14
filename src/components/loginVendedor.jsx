import React from 'react';
import './styleLogin.css';
import image from '../img/pngwing.com12.png'; // Asegúrate de que la ruta es correcta

// Importa Bootstrap si lo necesitas
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';

const LoginVendedor = () => {
    return (
        <div className="bg-dark-x">
            <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;600&display=swap" rel="stylesheet"/>

            <section>
                <div className="row g-0">
                    <div className="col-lg-7 d-none d-lg-block">
                        <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item img-1 min-vh-100 active"></div>
                                <div className="carousel-item img-2 min-vh-100"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 min-vh-100">
                        <div className="px-lg-5 pt-lg-4 pb-lg-3 p-4 w-100 mb-auto">
                            <img src={image} className="img-fluid" alt="Imagen descriptiva"/>
                        </div>
                        <div className="px-lg-5 py-lg-4 p-4 w-100 align-self-center">
                            <h1 className="form-label font-weight-bold mb-4">Bienvenido</h1>
                            <form className="mb-5">
                                <div className="mb-4">
                                    <label htmlFor="exampleInputEmail1" className="form-label font-weight-bold">Usuario</label>
                                    <input type="text" className="form-control bg-dark-x border-0 text-bg-dark" placeholder="Ingresa tu usuario"
                                        id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="exampleInputPassword1" className="form-label font-weight-bold">Contraseña</label>
                                    <input type="password" className="form-control bg-dark-x border-0 mb-2 text-bg-dark"
                                        placeholder="Ingresa tu contraseña" id="exampleInputPassword1"/>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
                            </form>
                            <p className="form-label font-weight-bold text-center">O inicia sesión como administrador</p>
                            <div className="d-flex justify-content-around">
                                <Link to="/admin/login">
                                    <button type="button" className="btn btn-outline-light">Soy administrador</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginVendedor;
