import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

// Define una clase de CSS personalizada para cambiar el color de los iconos
const redIconStyle = {
  color: 'red',
};

const DashboardCard = ({ title, value, icon }) => (
  <Card style={{ background: '#333', color: '#fff' }}>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      {/* Aplica el estilo personalizado a los iconos */}
      <FontAwesomeIcon icon={icon} size="lg" style={redIconStyle} />
      <Card.Text>{value}</Card.Text>
    </Card.Body>
  </Card>
);

const Dashboard = () => (
  <div style={{ background: '#222', padding: '20px' }}>
    <Row xs={1} md={2} lg={4} className="g-4">
      <Col>
        <DashboardCard
          title="Today Sale"
          value="$1234"
          icon={faChartLine}
        />
      </Col>
      <Col>
        <DashboardCard
          title="Total Sale"
          value="$1234"
          icon={faChartLine}
        />
      </Col>
      <Col>
        <DashboardCard
          title="Today Revenue"
          value="$1234"
          icon={faChartPie}
        />
      </Col>
      <Col>
        <DashboardCard
          title="Total Revenue"
          value="$1234"
          icon={faChartPie}
        />
      </Col>
    </Row>
  </div>
);

export default Dashboard;
