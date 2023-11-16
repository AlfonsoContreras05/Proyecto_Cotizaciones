-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-11-2023 a las 21:23:36
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistemacotizaciones`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `ID_Administrador` int(11) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Apellido` varchar(255) DEFAULT NULL,
  `Correo_Electronico` varchar(255) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_producto`
--

CREATE TABLE `categoria_producto` (
  `ID_Categoria` int(11) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_producto`
--

INSERT INTO `categoria_producto` (`ID_Categoria`, `Nombre`, `Descripcion`) VALUES
(1, 'Placas Madre', 'Placas base para ensamblar componentes de computadora'),
(2, 'Procesadores', 'Unidades centrales de procesamiento para computadoras'),
(3, 'Tarjetas Gráficas', 'Componentes para procesamiento gráfico y rendimiento visual'),
(4, 'Fuentes de Poder', 'Suministro de energía para componentes de computadora');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `ID_Cliente` int(11) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Apellido` varchar(255) DEFAULT NULL,
  `rut` varchar(13) NOT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Correo_Electronico` varchar(255) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizacion`
--

CREATE TABLE `cotizacion` (
  `ID_Cotizacion` int(11) NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `ID_Vendedor` int(11) DEFAULT NULL,
  `Fecha_Cotizacion` date NOT NULL,
  `Estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `ID_DetalleVenta` int(11) NOT NULL,
  `ID_Transaccion` int(11) DEFAULT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Precio_Unitario` decimal(10,2) DEFAULT NULL,
  `Descuento` decimal(10,2) DEFAULT NULL,
  `ID_Vendedor` int(11) DEFAULT NULL,
  `ID_Cotizacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fuentepoder`
--

CREATE TABLE `fuentepoder` (
  `ID_FuentePoder` int(11) NOT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `TipoFuente` varchar(15) DEFAULT NULL,
  `PotenciaW` varchar(10) DEFAULT NULL,
  `Corriente` varchar(15) DEFAULT NULL,
  `ImagenURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fuentepoder`
--

INSERT INTO `fuentepoder` (`ID_FuentePoder`, `ID_Producto`, `TipoFuente`, `PotenciaW`, `Corriente`, `ImagenURL`) VALUES
(1, 10, 'Corsair', '750W', '80 Plus Gold', 'url_imagen_10'),
(2, 11, 'EVGA', '600W', '80 Plus Bronze', 'url_imagen_11'),
(3, 12, 'Thermaltake', '500W', '80 Plus White', 'url_imagen_12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID_Pedido` int(11) NOT NULL,
  `ID_Cliente` int(11) DEFAULT NULL,
  `Fecha_Pedido` date DEFAULT NULL,
  `Fecha_Estimada_Entrega` date DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `placamadre`
--

CREATE TABLE `placamadre` (
  `ID_PlacaMadre` int(11) NOT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `ArkPlaca` varchar(20) NOT NULL,
  `TipoPlaca` varchar(20) NOT NULL,
  `SoporteDDR` varchar(10) DEFAULT NULL,
  `ImagenURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `placamadre`
--

INSERT INTO `placamadre` (`ID_PlacaMadre`, `ID_Producto`, `ArkPlaca`, `TipoPlaca`, `SoporteDDR`, `ImagenURL`) VALUES
(11, 1, 'Z490', 'Intel', 'DDR4', 'url_imagen_1'),
(12, 2, 'B550', 'AMD', 'DDR4', 'url_imagen_2'),
(13, 3, 'X570', 'AMD', 'DDR4', 'url_imagen_3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `procesador`
--

CREATE TABLE `procesador` (
  `ID_Procesador` int(11) NOT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `ArkProcesador` varchar(20) DEFAULT NULL,
  `Frecuencia` varchar(15) NOT NULL,
  `ImagenURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `procesador`
--

INSERT INTO `procesador` (`ID_Procesador`, `ID_Producto`, `ArkProcesador`, `Frecuencia`, `ImagenURL`) VALUES
(1, 4, 'Intel Core i9', '3.7 GHz', 'url_imagen_4'),
(2, 5, 'AMD Ryzen 7', '3.8 GHz', 'url_imagen_5'),
(3, 6, 'Intel Core i5', '2.9 GHz', 'url_imagen_6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_Producto` int(11) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Descripcion` text DEFAULT NULL,
  `Precio` int(10) DEFAULT NULL,
  `ID_Categoria` int(11) DEFAULT NULL,
  `Stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_Producto`, `Nombre`, `Descripcion`, `Precio`, `ID_Categoria`, `Stock`) VALUES
(1, 'Placa Madre Z490', 'Placa Madre para procesadores Intel con socket Z490, soporte DDR4', 120, 1, 20),
(2, 'Placa Madre B550', 'Placa Madre para procesadores AMD con socket B550, soporte DDR4', 100, 1, 15),
(3, 'Placa Madre X570', 'Placa Madre de alto rendimiento para AMD, socket X570, soporte DDR4', 180, 1, 10),
(4, 'Intel Core i9', 'Procesador Intel Core i9, 10a generación, 3.7 GHz', 450, 2, 10),
(5, 'AMD Ryzen 7', 'Procesador AMD Ryzen 7, 3.8 GHz, 8 núcleos', 330, 2, 12),
(6, 'Intel Core i5', 'Procesador Intel Core i5, 10a generación, 2.9 GHz', 250, 2, 20),
(7, 'NVIDIA RTX 3080', 'Tarjeta gráfica NVIDIA RTX 3080, 10GB GDDR6X', 700, 3, 8),
(8, 'AMD Radeon RX 6800', 'Tarjeta gráfica AMD Radeon RX 6800, 16GB GDDR6', 650, 3, 6),
(9, 'NVIDIA GTX 1660', 'Tarjeta gráfica NVIDIA GTX 1660, 6GB GDDR5', 300, 3, 15),
(10, 'Corsair 750W', 'Fuente de poder Corsair, 750W, certificación 80 Plus Gold', 90, 4, 20),
(11, 'EVGA 600W', 'Fuente de poder EVGA, 600W, certificación 80 Plus Bronze', 60, 4, 25),
(12, 'Thermaltake 500W', 'Fuente de poder Thermaltake, 500W, certificación 80 Plus White', 45, 4, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `ID_Sucursal` int(11) NOT NULL,
  `Ubicacion` varchar(255) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Horario_Atencion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursal`
--

INSERT INTO `sucursal` (`ID_Sucursal`, `Ubicacion`, `Telefono`, `Horario_Atencion`) VALUES
(1, 'Stgo Centro', '+56911223344', '08:00 AM - 20:00 PM'),
(2, 'Puente Alto', '+56922334455', '7:00 AM - 21:00 PM');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjetagrafica`
--

CREATE TABLE `tarjetagrafica` (
  `ID_TarjetaGrafica` int(11) NOT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `TipoGrafica` varchar(30) DEFAULT NULL,
  `Memoria` varchar(15) DEFAULT NULL,
  `TipoMemoria` varchar(10) DEFAULT NULL,
  `ImagenURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjetagrafica`
--

INSERT INTO `tarjetagrafica` (`ID_TarjetaGrafica`, `ID_Producto`, `TipoGrafica`, `Memoria`, `TipoMemoria`, `ImagenURL`) VALUES
(1, 7, 'NVIDIA RTX 3080', '10GB', 'GDDR6X', 'url_imagen_7'),
(2, 8, 'AMD Radeon RX 6800', '16GB', 'GDDR6', 'url_imagen_8'),
(3, 9, 'NVIDIA GTX 1660', '6GB', 'GDDR5', 'url_imagen_9');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transaccion`
--

CREATE TABLE `transaccion` (
  `ID_Transaccion` int(11) NOT NULL,
  `ID_Cliente` int(11) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `ID_Sucursal` int(11) DEFAULT NULL,
  `Metodo_Pago` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedor`
--

CREATE TABLE `vendedor` (
  `ID_Vendedor` int(11) NOT NULL,
  `Nombre` varchar(255) DEFAULT NULL,
  `Apellido` varchar(255) DEFAULT NULL,
  `Correo_Electronico` varchar(255) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `ID_Sucursal` int(11) DEFAULT NULL,
  `Area_Especializacion` varchar(255) DEFAULT NULL,
  `pass` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vendedor`
--

INSERT INTO `vendedor` (`ID_Vendedor`, `Nombre`, `Apellido`, `Correo_Electronico`, `Telefono`, `ID_Sucursal`, `Area_Especializacion`, `pass`) VALUES
(1, 'Alfonso', 'Contreras', 'Orfhe@gmail.com', '+56911223344', 1, 'Armado', '123');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`ID_Administrador`);

--
-- Indices de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD PRIMARY KEY (`ID_Categoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`ID_Cliente`);

--
-- Indices de la tabla `cotizacion`
--
ALTER TABLE `cotizacion`
  ADD PRIMARY KEY (`ID_Cotizacion`),
  ADD KEY `ID_Cliente` (`ID_Cliente`),
  ADD KEY `ID_Vendedor` (`ID_Vendedor`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`ID_DetalleVenta`),
  ADD KEY `ID_Transaccion` (`ID_Transaccion`),
  ADD KEY `ID_Vendedor` (`ID_Vendedor`),
  ADD KEY `detalle_venta_ibfk_2` (`ID_Producto`),
  ADD KEY `ID_Cotizacion` (`ID_Cotizacion`);

--
-- Indices de la tabla `fuentepoder`
--
ALTER TABLE `fuentepoder`
  ADD PRIMARY KEY (`ID_FuentePoder`),
  ADD KEY `fuentepoder_ibfk_1` (`ID_Producto`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ID_Pedido`),
  ADD KEY `ID_Cliente` (`ID_Cliente`);

--
-- Indices de la tabla `placamadre`
--
ALTER TABLE `placamadre`
  ADD PRIMARY KEY (`ID_PlacaMadre`),
  ADD KEY `placamadre_ibfk_1` (`ID_Producto`);

--
-- Indices de la tabla `procesador`
--
ALTER TABLE `procesador`
  ADD PRIMARY KEY (`ID_Procesador`),
  ADD KEY `procesador_ibfk_1` (`ID_Producto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Producto`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`ID_Sucursal`);

--
-- Indices de la tabla `tarjetagrafica`
--
ALTER TABLE `tarjetagrafica`
  ADD PRIMARY KEY (`ID_TarjetaGrafica`),
  ADD KEY `tarjetagrafica_ibfk_1` (`ID_Producto`);

--
-- Indices de la tabla `transaccion`
--
ALTER TABLE `transaccion`
  ADD PRIMARY KEY (`ID_Transaccion`),
  ADD KEY `ID_Cliente` (`ID_Cliente`),
  ADD KEY `ID_Sucursal` (`ID_Sucursal`);

--
-- Indices de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  ADD PRIMARY KEY (`ID_Vendedor`),
  ADD KEY `ID_Sucursal` (`ID_Sucursal`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `ID_Categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cotizacion`
--
ALTER TABLE `cotizacion`
  MODIFY `ID_Cotizacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fuentepoder`
--
ALTER TABLE `fuentepoder`
  MODIFY `ID_FuentePoder` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `placamadre`
--
ALTER TABLE `placamadre`
  MODIFY `ID_PlacaMadre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `procesador`
--
ALTER TABLE `procesador`
  MODIFY `ID_Procesador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `tarjetagrafica`
--
ALTER TABLE `tarjetagrafica`
  MODIFY `ID_TarjetaGrafica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cotizacion`
--
ALTER TABLE `cotizacion`
  ADD CONSTRAINT `cotizacion_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`),
  ADD CONSTRAINT `cotizacion_ibfk_2` FOREIGN KEY (`ID_Vendedor`) REFERENCES `vendedor` (`ID_Vendedor`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`ID_Transaccion`) REFERENCES `transaccion` (`ID_Transaccion`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`),
  ADD CONSTRAINT `detalle_venta_ibfk_3` FOREIGN KEY (`ID_Vendedor`) REFERENCES `vendedor` (`ID_Vendedor`),
  ADD CONSTRAINT `detalle_venta_ibfk_4` FOREIGN KEY (`ID_Cotizacion`) REFERENCES `cotizacion` (`ID_Cotizacion`);

--
-- Filtros para la tabla `fuentepoder`
--
ALTER TABLE `fuentepoder`
  ADD CONSTRAINT `fuentepoder_ibfk_1` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`);

--
-- Filtros para la tabla `placamadre`
--
ALTER TABLE `placamadre`
  ADD CONSTRAINT `placamadre_ibfk_1` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `procesador`
--
ALTER TABLE `procesador`
  ADD CONSTRAINT `procesador_ibfk_1` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `tarjetagrafica`
--
ALTER TABLE `tarjetagrafica`
  ADD CONSTRAINT `tarjetagrafica_ibfk_1` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `transaccion`
--
ALTER TABLE `transaccion`
  ADD CONSTRAINT `transaccion_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`),
  ADD CONSTRAINT `transaccion_ibfk_2` FOREIGN KEY (`ID_Sucursal`) REFERENCES `sucursal` (`ID_Sucursal`);

--
-- Filtros para la tabla `vendedor`
--
ALTER TABLE `vendedor`
  ADD CONSTRAINT `vendedor_ibfk_1` FOREIGN KEY (`ID_Sucursal`) REFERENCES `sucursal` (`ID_Sucursal`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
