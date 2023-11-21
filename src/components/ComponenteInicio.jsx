import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import NavbarComponent from './NavbarComponent';
import '../css/StyleInicio.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoVentasDiarias = () => {
    const [ventasDiarias, setVentasDiarias] = useState([]);
    const idVendedor = localStorage.getItem("idVendedor");

    useEffect(() => {
        const cargarDatosVentas = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/api/ventas-vendedor/${idVendedor}`);
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
    }, [idVendedor]);

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

    return (
        <div className='container-p'>
            <NavbarComponent />
            <div className="grid-container">
                <div className="chart-container">
                    <h2>Ventas Diarias 1</h2>
                    <div style={{ height: '400px', maxWidth: '100%' }}>
                        <Bar data={datosDelGrafico} options={opcionesDelGrafico} />
                    </div>
                </div>
                <div className="chart-container">
                    <h2>Ventas Diarias 2</h2>
                    <div style={{ height: '400px', maxWidth: '100%' }}>
                        <Bar data={datosDelGrafico} options={opcionesDelGrafico} />
                    </div>
                </div>
            </div>
        </div>
    );
    
    
};

export default GraficoVentasDiarias;
