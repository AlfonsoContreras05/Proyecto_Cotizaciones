import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

function TrafficChart() {
  const [dataChart, setDataChart] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetch(`http://localhost:5000/api/ventas-por-vendedor/${currentYear}`)
      .then(response => response.json())
      .then(data => {
        // Transforma los datos para que se ajusten al formato necesario para el gráfico
        const ventasPorVendedor = {}; // Objeto para almacenar las ventas por vendedor
  
        // Itera sobre cada registro y organiza las ventas por vendedor y mes
        data.forEach(({ ID_Vendedor, Nombre, Mes, TotalVentas }) => {
          if (!ventasPorVendedor[ID_Vendedor]) {
            ventasPorVendedor[ID_Vendedor] = {
              label: Nombre,
              data: new Array(12).fill(0), // Inicializa un array para los 12 meses
              fill: false,
             // borderColor: /* asigna un color aquí */,
              tension: 0.1
            };
          }
          ventasPorVendedor[ID_Vendedor].data[Mes - 1] = TotalVentas; // Mes - 1 porque los meses en JS son 0-indexados
        });
  
        setDataChart({
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: Object.values(ventasPorVendedor)
        });
      })
      .catch(error => console.error('Error al obtener ventas por vendedor:', error));
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col xs={12} md={10} lg={8}>
          <Card>
            <Card.Body>
              <Card.Title>Ventas por Vendedor - {new Date().getFullYear()}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Seguimiento Mensual</Card.Subtitle>
              <div style={{ height: '300px', marginBottom: '20px' }}>
                <Line data={dataChart} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TrafficChart;
