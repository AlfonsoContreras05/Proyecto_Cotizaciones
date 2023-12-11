import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CResumen from "./CResumen";
import NavBarAdmin from "./navBarAmin";
import GraficoBarra from "./CGraficoBarra";
import GraficoLineas from './GrafLineas';
class MiComponente extends Component {
  constructor(props) {
    super(props);
    // Aquí puedes inicializar el estado si es necesario
    this.state = {
      // estadoInicial: valorInicial
    };
  }

  componentDidMount() {
    // Este método se llama después de que el componente se monta en el DOM
    // Puedes realizar inicializaciones, solicitudes de datos, etc. aquí
  }

  componentWillUnmount() {
    // Este método se llama antes de que el componente se desmonte
    // Puedes realizar limpieza de recursos, cancelar solicitudes, etc. aquí
  }

  render() {
    return (
      <Container className='mt-5'>
        <Row>
          <Col>
            <NavBarAdmin />
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <CResumen />
          </Col>
        </Row>

        <Row className="my-4">
          <Col lg={12}>
            <GraficoBarra />
          </Col>

        </Row>
        <Row className="my-4">

        <Col lg={12}>
            <GraficoLineas />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default MiComponente;
