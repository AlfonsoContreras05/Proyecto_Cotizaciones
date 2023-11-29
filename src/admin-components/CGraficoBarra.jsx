import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/StyleGrafBar.css';



const data = {
  labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
  datasets: [
    {
      label: 'Ventas Globales ($)',
      data: [12000, 19000, 3000, 5000, 2000, 3000, 4000], // Reemplaza estos valores con tus datos reales
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const data2 = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
  datasets: [
    {
      type: 'line',
      label: 'Meta ($)',
      data: [5000, 6000, 7000, 8000, 9000, 10000, 11000], // Metas
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
    {
      type: 'bar',
      label: 'Ventas ($)',
      data: [4000, 7000, 3000, 6000, 8000, 9000, 12000], // Ventas
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const options2 = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

// Datos y opciones para el gráfico del Top 10 de Productos
const dataTopProductos = {
  labels: ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5', 'Producto 6', 'Producto 7', 'Producto 8', 'Producto 9', 'Producto 10'],
  datasets: [
    {
      label: 'Ventas',
      data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 15], // Datos simulados de ventas
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const optionsTopProductos = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false, // Ocultar leyenda si se prefiere
    },
  },
};


function DashboardCharts() {
  return (
    <Container className="d-flex justify-content-center align-items-center max-width-xxl">
      <Row className="g-4">
        <Col md={4}>
          <Card className="text-white bg-dark h-100">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Venta Global
                <Button variant="danger">Descargame</Button>
              </Card.Title>
              <Bar data={data} options={options} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-white bg-dark h-100">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Venta v/s Meta
                <Button variant="danger">Descargame</Button>
              </Card.Title>
              <div className="chart-container" style={{ position: 'relative', height: '200px' }}>
                <Bar data={data2} options={options2} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
  <Card className="text-white bg-dark h-100">
    <Card.Body>
      <Card.Title className="d-flex justify-content-between align-items-center">
        Top 10 de Productos
        <Button variant="danger">Descargame</Button>
      </Card.Title>
      <div className="chart-container" style={{ position: 'relative', height: '200px' }}>
        {/* Asegúrate de tener el componente Bar y los datos correspondientes importados */}
        <Bar data={dataTopProductos} options={optionsTopProductos} />
      </div>
    </Card.Body>
  </Card>
</Col>

      </Row>
    </Container>
  );
}
export default DashboardCharts;
