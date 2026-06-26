// ============================================================
//  ComercioTech — Módulo Principal del Frontend
//  Archivo: public/js/app.js
//
//  Responsabilidad:
//    - Definir la URL base de la API
//    - Proveer funciones utilitarias globales compartidas
//      entre los módulos de clientes, productos y pedidos
//    - Controlar la navegación entre pestañas
//    - Inicializar la aplicación al cargar la página
// ============================================================

// ------------------------------------------------------------
// CONFIGURACIÓN GLOBAL
// Cambia esta URL por la IP de tu VM cuando despliegues:
//   const API_BASE = 'http://192.168.X.X:3000/api';
// ------------------------------------------------------------
const API_BASE = 'http://localhost:3000/api';

// ============================================================
//  UTILIDADES GLOBALES
// ============================================================

/**
 * Muestra una notificación temporal en la esquina inferior derecha.
 * @param {string} mensaje - Texto de la notificación
 * @param {string} tipo    - 'success' | 'error' | 'warning'
 */
function toast(mensaje, tipo = 'success') {
  const el    = document.getElementById('toast');
  el.textContent = mensaje;
  el.className   = `show ${tipo}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = ''; }, 3200);
}

/**
 * Formatea un número como precio en dólares.
 * @param {number} n - Valor numérico
 * @returns {string} Ej: "$1,250.50"
 */
function formatPrecio(n) {
  return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Formatea una fecha ISO a formato chileno dd/mm/aaaa.
 * @param {string} iso - Fecha en formato ISO
 * @returns {string} Ej: "15/06/2024"
 */
function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

/**
 * Genera un badge HTML con el color correspondiente al estado del pedido.
 * @param {string} estado - Estado del pedido
 * @returns {string} HTML del badge
 */
function badgeEstado(estado) {
  const clase = estado ? estado.toLowerCase() : '';
  return `<span class="badge badge--${clase}">${estado || '—'}</span>`;
}

/**
 * Genera texto coloreado según el nivel de stock.
 * Verde: stock normal | Amarillo: stock bajo | Rojo: sin stock
 * @param {number} stock - Cantidad en inventario
 * @returns {string} HTML con el stock formateado
 */
function badgeStock(stock) {
  if (stock === 0)  return `<span class="stock--zero">${stock} — Sin stock</span>`;
  if (stock <= 10)  return `<span class="stock--low">${stock} — Stock bajo</span>`;
  return `<span class="stock--ok">${stock}</span>`;
}

/**
 * Abre un modal por su ID.
 * @param {string} id - ID del elemento modal-overlay
 */
function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}

/**
 * Cierra un modal, limpia el formulario y resetea el campo de ID oculto.
 * @param {string} id - ID del elemento modal-overlay
 */
function cerrarModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.remove('open');
  overlay.querySelector('form')?.reset();
  const hiddenId = overlay.querySelector('input[type="hidden"]');
  if (hiddenId) hiddenId.value = '';
}

// ============================================================
//  NAVEGACIÓN POR PESTAÑAS
// ============================================================

/**
 * Muestra la sección seleccionada y oculta las demás.
 * Llama al cargador de datos correspondiente.
 * @param {string} tab   - Nombre de la pestaña ('clientes' | 'productos' | 'pedidos')
 * @param {Element} btn  - Botón clickeado (para activar su clase)
 */
function showTab(tab, btn) {
  // Ocultar todas las secciones y desactivar todos los tabs
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Activar sección y pestaña seleccionada
  document.getElementById('sec-' + tab).classList.add('active');
  btn.classList.add('active');

  // Cargar los datos de la sección activa
  const cargadores = {
    clientes:  cargarClientes,
    productos: cargarProductos,
    pedidos:   cargarPedidos
  };

  if (cargadores[tab]) cargadores[tab]();
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Cargar clientes al iniciar (pestaña por defecto)
  cargarClientes();
});
