import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

const redIconStyle = {
  color: 'red',
};

const DashboardCard = ({ title, value, icon }) => (
  <Card style={{ background: '#333', color: '#fff' }}>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <FontAwesomeIcon icon={icon} size="lg" style={redIconStyle} />
      <Card.Text>{value}</Card.Text>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const [ventasDiarias, setVentasDiarias] = useState(0);
  const [ventasMensuales, setVentasMensuales] = useState(0);
  const [ventasAnuales, setVentasAnuales] = useState(0);

  

  useEffect(() => {
    // Aquí puedes hacer tus llamadas a la API para obtener los datos
    // Por ejemplo, usando fetch para obtener las ventas diarias
    fetch('http://localhost:5000/api/ventas-diarias')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then(data => setVentasDiarias(data.ventasDiarias))
    .catch(error => console.error('Error al obtener ventas diarias:', error));

    // Hacer lo mismo para ventas mensuales y anuales
    fetch('http://localhost:5000/api/ventas-mensuales')
    .then(response => response.json())
    .then(data => setVentasMensuales(data.ventasMensuales));

    fetch('http://localhost:5000/api/ventas-anuales')
    .then(response => response.json())
    .then(data => setVentasAnuales(data.ventasAnuales));


  }, []);

  return (
    <div style={{ background: '#222', padding: '20px', margin: '4% 0 0 0'}}>
      <Row xs={1} md={2} lg={4} className="g-4">
        <Col>
          <DashboardCard
            title="Venta Diaria"
            value={`$${ventasDiarias}`}
            icon={faChartLine}
          />
        </Col>
        <Col>
          <DashboardCard
            title="Venta Mensual"
            value={`$${ventasMensuales}`}
            icon={faChartLine}
          />
        </Col>
        <Col>
          <DashboardCard
            title="Venta Anual"
            value={`$${ventasAnuales}`}
            icon={faChartPie}
          />
        </Col>
        {/* La cuarta tarjeta sigue igual, ya que no mencionaste integrar datos de la base de datos para ella */}
        <Col>
          <DashboardCard
            title="Meta"
            value="$1234"
            icon={faChartPie}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
