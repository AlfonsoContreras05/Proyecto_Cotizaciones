import React, { Component } from 'react';
import CResumen from "./CResumen";
import NavBarAdmin from "./navBarAmin"
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
      <div>
              {<NavBarAdmin/>}
              {<CResumen/>}

      </div>
    );
  }
}

export default MiComponente;
