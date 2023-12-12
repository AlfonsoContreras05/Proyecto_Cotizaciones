import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
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
      .then(data => processData(data))
      .catch(error => console.error('Error al obtener ventas por vendedor:', error));
  }, []);

  const processData = (data) => {
    const ventasPorVendedor = {};
    data.forEach(({ ID_Vendedor, Nombre, Mes, TotalVentas }) => {
      if (!ventasPorVendedor[ID_Vendedor]) {
        ventasPorVendedor[ID_Vendedor] = {
          label: Nombre,
          data: new Array(12).fill(0),
          fill: false,
          tension: 0.1
        };
      }
      ventasPorVendedor[ID_Vendedor].data[Mes - 1] = TotalVentas;
    });
  
    setDataChart({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: Object.values(ventasPorVendedor)
    });
  };

  const exportToExcel = () => {
    const excelData = dataChart.datasets.map(dataset => {
      return {
        Cruce: dataset.label,
        Ene: dataset.data[0] || 0, // Asignar 0 si no hay valor
        Feb: dataset.data[1] || 0,
        Mar: dataset.data[2] || 0,
        Abr: dataset.data[3] || 0,
        May: dataset.data[4] || 0,
        Jun: dataset.data[5] || 0,
        Jul: dataset.data[6] || 0,
        Ago: dataset.data[7] || 0,
        Sep: dataset.data[8] || 0,
        Oct: dataset.data[9] || 0,
        Nov: dataset.data[10] || 0,
        Dic: dataset.data[11] || 0,
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
  // Define el rango de celdas del worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({c:C, r:R});
        const cell = worksheet[cell_ref];
        if (cell && !isNaN(cell.v)) {
          cell.t = 'n'; // Tipo numérico
          cell.z = '0'; // Formato de número con dos decimales

          // Aquí es donde aplicamos el formato de moneda
          cell.z = '"$"#,##0;[Red]-"$"#,##0';

          if (cell.v > 0) {
            if (!cell.s) cell.s = {};
            cell.s.fill = {
              patternType: "solid",
              fgColor: { rgb: "00FF00" } // Verde
            };
          }
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
    XLSX.writeFile(workbook, `Ventas_por_Vendedor_${new Date().getFullYear()}.xlsx`);
  };

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col xs={12} md={10} lg={8}>
          <Card>
            <Card.Body>
              <Card.Title>Ventas por Vendedor - {new Date().getFullYear()}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Seguimiento Mensual</Card.Subtitle>
              <Button onClick={exportToExcel} variant="primary" style={{ marginBottom: '20px' }}>
                Exportar a Excel
              </Button>
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
