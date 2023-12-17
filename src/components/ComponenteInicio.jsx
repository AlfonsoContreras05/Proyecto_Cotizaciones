import React, { useEffect, useState, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import NavbarComponent from './NavbarComponent';
import '../css/StyleInicio.css';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import TimeoutModal from './modalTime';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoVentasDiarias = () => {
    const [ventasDiarias, setVentasDiarias] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const idVendedor = localStorage.getItem("idVendedor");
    const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local

    const navigate = useNavigate();

    const handleUnauthorized = useCallback(() => {
        localStorage.removeItem("token");
        navigate('/');
    }, [navigate]); 

    useEffect(() => {
        const cargarDatosVentas = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/api/ventas-vendedor/${idVendedor}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (respuesta.status === 401) {
                    handleUnauthorized();
                    return;
                }
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setVentasDiarias(datos);
                } else {
                    console.error("Error en la respuesta del servidor");
                }
            } catch (error) {
                console.error("Error al cargar datos de ventas:", error);
            }
        };

        if (idVendedor) {
            cargarDatosVentas();
        }
    }, [idVendedor, token, handleUnauthorized]);

    useEffect(() => {
        const cargarProductosMasVendidos = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/api/productos-mas-cotizados/${idVendedor}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (respuesta.status === 401) {
                    handleUnauthorized();
                    return;
                }
                if (respuesta.ok) {
                    const productos = await respuesta.json();
                    setProductosMasVendidos(productos);
                } else {
                    console.error("Error en la respuesta del servidor al obtener productos más vendidos");
                }
            } catch (error) {
                console.error("Error al cargar los productos más vendidos:", error);
            }
        };

        if (idVendedor) {
            cargarProductosMasVendidos();
        }
    }, [idVendedor, token, handleUnauthorized]);




    useEffect(() => {
        console.log(productosMasVendidos); // Imprime el estado actualizado
    }, [productosMasVendidos]);


    const datosGraficoProductos = {
        labels: productosMasVendidos.map(p => p.Nombre),
        datasets: [{
            label: 'Productos Más Vendidos',
            data: productosMasVendidos.map(p => parseFloat(p.TotalCotizado)),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    console.log(datosGraficoProductos);


    const obtenerFechasDelMes = () => {
        const fechas = [];
        const fechaActual = new Date();
        fechaActual.setDate(1); // Establecer al primer día del mes actual

        const mesActual = fechaActual.getMonth();

        while (fechaActual.getMonth() === mesActual) {
            fechas.push(fechaActual.toISOString().split('T')[0]);
            fechaActual.setDate(fechaActual.getDate() + 1);
        }

        return fechas;
    };

    const mapearVentasPorFecha = (fechas, ventas) => {
        return fechas.map(fecha => {
            const venta = ventas.find(v => v.Fecha === fecha);
            return venta ? venta.TotalVenta : 0;
        });
    };

    const fechasDelMes = obtenerFechasDelMes();
    const datosGrafico = mapearVentasPorFecha(fechasDelMes, ventasDiarias);

    const datosDelGrafico = {
        labels: fechasDelMes,
        datasets: [{
            label: 'Ventas Diarias',
            data: datosGrafico,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    };

    const opcionesDelGrafico = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(ventasDiarias);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "VentasDiarias");
      
        // Escribe el archivo y desencadena la descarga
        XLSX.writeFile(wb, "ventas_diarias.xlsx");
      };
      
      const descargarExcelProductos = () => {
        // Crear un nuevo libro y hoja de trabajo
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(productosMasVendidos);
    
        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, "Productos Más Vendidos");
    
        // Escribir el libro y descargarlo
        XLSX.writeFile(wb, "ProductosMasVendidos.xlsx");
    };

    return (
        <div className='container-p'>
            <NavbarComponent />
            <div className="grid-container">
                {/* Contenedor del primer gráfico y su botón de descarga */}
                <div className="chart-container">
                    <h2>Ventas Diarias</h2>
                    <div style={{ height: '400px', maxWidth: '100%' }}>
                        <Bar data={datosDelGrafico} options={opcionesDelGrafico} />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button onClick={exportToExcel}>Descargar Excel Ventas Diarias</button>
                    </div>
                </div>
    
                {/* Contenedor del segundo gráfico y su botón de descarga */}
                <div className="chart-container">
                    <h2>Productos Más Vendidos</h2>
                    <div style={{ height: '400px', maxWidth: '100%' }}>
                        {productosMasVendidos.length > 0 ? (
                            <Bar data={datosGraficoProductos} options={opcionesDelGrafico} />
                        ) : (
                            <p>Cargando datos...</p>
                        )}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button onClick={descargarExcelProductos}>Descargar Excel Productos Más Vendidos</button>
                    </div>
                </div>
            </div>
            <TimeoutModal />
        </div>
    );
    
};

export default GraficoVentasDiarias;
