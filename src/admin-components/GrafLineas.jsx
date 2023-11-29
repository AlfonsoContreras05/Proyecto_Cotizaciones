import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Col, Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function VentasMensualesVendedores() {
  const dataVentasMensuales = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
    datasets: [
      {
        label: 'Vendedor 1',
        data: [10, 20, 30, 40, 50, 60, 70,50,40,90,20], // Datos simulados para Vendedor 1
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Vendedor 2',
        data: [20, 30, 10, 50, 60, 40, 70,30,90,80,40], // Datos simulados para Vendedor 2
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      // Agrega más vendedores aquí si es necesario
    ],
  };

  const optionsVentasMensuales = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={10} style={{ maxWidth: '90%' }}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Ventas Mensuales por Vendedor</Card.Title>
              <div style={{ position: 'relative', height: '60vh', width: '100%' }}>
                <Line data={dataVentasMensuales} options={optionsVentasMensuales} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VentasMensualesVendedores;
