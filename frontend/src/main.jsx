/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Archivo: main.jsx
 * Descripción:
 * Punto de entrada de la aplicación Frontend de Farmacia Online VidaSalud.
 * Este archivo monta la aplicación React en el navegador, habilita
 * el enrutamiento mediante React Router y activa el modo estricto
 * de React para detectar posibles problemas durante el desarrollo.
 *
 * Dependencias:
 * - React: Biblioteca principal para construir la interfaz.
 * - ReactDOM: Renderiza la aplicación en el DOM.
 * - BrowserRouter: Gestiona la navegación entre páginas.
 * - App: Componente principal de la aplicación.
 * - index.css: Estilos globales del proyecto.
 *
 * Autor: Equipo VidaSalud
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

/**
 * Renderiza la aplicación React en el elemento con id "root".
 *
 * Estructura:
 * - StrictMode: Ayuda a detectar posibles problemas durante el desarrollo.
 * - BrowserRouter: Habilita la navegación entre las distintas rutas.
 * - App: Componente principal de la aplicación.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);