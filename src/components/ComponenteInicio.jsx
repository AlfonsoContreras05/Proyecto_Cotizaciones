import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
//import Chart from 'chart.js/auto';
import NavbarComponent from "./NavbarComponent";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import "../css/StyleHistorial.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoVentasVendedor = () => {
    const [datosVentas, setDatosVentas] = useState([]);

    const idVendedor = localStorage.getItem("idVendedor");

    useEffect(() => {
        const cargarDatosVentas = async () => {
            try {
                const respuesta = await fetch(`http://localhost:5000/api/ventas-vendedor/${idVendedor}`);
                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setDatosVentas(datos);
                }
            } catch (error) {
                console.error("Error al cargar datos de ventas:", error);
            }
        };
        cargarDatosVentas();
    }, [idVendedor]);

    const diasDelMes = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();
        const dias = new Date(año, mes + 1, 0).getDate();

        return Array.from({ length: dias }, (_, i) => `${año}-${mes + 1}-${i + 1}`);
    };

    // Mapear datos de ventas a los días del mes
    const datosPorDia = diasDelMes().map(dia => {
        const venta = datosVentas.find(d => d.Fecha === dia);
        return venta ? venta.TotalVenta : 0;
    });

    const data = {
        labels: diasDelMes(),
        datasets: [
            {
                label: 'Venta Diaria',
                data: datosPorDia,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
            },
        ],
    };
    const graficoEstilos = {
        width: '80%', // Ajusta el ancho como prefieras
        height: 'auto',
        margin: '0 auto', // Centra el gráfico
        padding: '0', // Añade un poco de espacio alrededor
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' // Opcional: añade una sombra para resaltar el gráfico
    };

    
    
    return (
        <div>
    <NavbarComponent />
    <div className="grafico-ventas-container">
        <h2 className="cat1" style={{ textAlign: "center" }}>Tus Ventas Del Mes</h2>
        <div style={graficoEstilos}>
            <Bar data={data} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
    </div>
</div>

    );
};

export default GraficoVentasVendedor;
