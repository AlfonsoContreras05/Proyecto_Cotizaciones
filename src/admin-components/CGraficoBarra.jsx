import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/StyleGrafBar.css';

function DashboardCharts() {
  return (
    <Container className="d-flex justify-content-center align-items-center max-width-xxl">
      <Row className="g-4">

        <Col md={4}>
          <Card className="text-white bg-dark h-100">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Venta Global
                <Button variant="danger">Show All</Button>
              </Card.Title>
              <img
                src="https://placehold.co/400x200"
                className="card-img-top"
                alt="Bar chart representing worldwide sales. Bars for USA, UK, and AU from 2016 to 2022. Each bar represents a year with varying heights according to sales value."
                style={{ maxHeight: '200px' }} // Set maxHeight as necessary
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-white bg-dark h-100">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Venta v/s Meta
                <Button variant="danger">Show All</Button>
              </Card.Title>
              <img
                src="https://placehold.co/400x200"
                className="card-img-top"
                alt="Combined chart representing sales and revenue from 2016 to 2022. The sales are shown with a line graph with points marked for each year, and the revenue is represented with a filled area chart below the sales line."
                style={{ maxHeight: '200px' }} // Set maxHeight as necessary
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-white bg-dark h-100">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Venta v/s Meta
                <Button variant="danger">Show All</Button>
              </Card.Title>
              <img
                src="https://placehold.co/400x200"
                className="card-img-top"
                alt="Combined chart representing sales and revenue from 2016 to 2022. The sales are shown with a line graph with points marked for each year, and the revenue is represented with a filled area chart below the sales line."
                style={{ maxHeight: '200px' }} // Set maxHeight as necessary
              />
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}

export default DashboardCharts;
