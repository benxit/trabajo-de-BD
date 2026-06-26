// ============================================================
//  ComercioTech — Módulo Frontend: Productos
//  Archivo: public/js/productos.js
//
//  Responsabilidad:
//    - Cargar y renderizar la tabla de productos
//    - Abrir/cerrar el modal de producto
//    - Enviar peticiones a la API para crear, editar y eliminar
//
//  Depende de: app.js (API_BASE, toast, formatPrecio, badgeStock, cerrarModal, abrirModal)
// ============================================================

// ============================================================
//  LEER — Cargar todos los productos desde la API
// ============================================================
async function cargarProductos() {
  const tbody = document.getElementById('tabla-productos');
  tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">⏳</div><div class="empty-state__text">Cargando productos...</div></div></td></tr>`;

  try {
    const res       = await fetch(`${API_BASE}/productos`);
    const respuesta = await res.json();
    const productos = respuesta.datos;

    // Actualizar contadores
    document.getElementById('count-productos').textContent  = productos.length;
    document.getElementById('metric-productos').textContent = productos.length;

    if (productos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">📦</div><div class="empty-state__text">No hay productos registrados aún</div></div></td></tr>`;
      return;
    }

    tbody.innerHTML = productos.map(p => `
      <tr>
        <td>
          <strong>${p.nombre}</strong>
          <div style="font-size:11px;color:var(--color-muted);margin-top:2px">${p.descripcion || '—'}</div>
        </td>
        <td><span class="badge badge--categoria">${p.categoria}</span></td>
        <td class="td-mono">${formatPrecio(p.precio)}</td>
        <td>${badgeStock(p.stock)}</td>
        <td>
          <div class="td-actions">
            <button class="btn btn--edit"   onclick="editarProducto('${p._id}')">✏ Editar</button>
            <button class="btn btn--danger" onclick="eliminarProducto('${p._id}', '${p.nombre}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

  } catch {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">❌</div><div class="empty-state__text">No se pudo conectar con el servidor</div></div></td></tr>`;
  }
}

// ============================================================
//  CREAR — Abrir modal vacío
// ============================================================
function abrirModalProducto() {
  document.getElementById('modal-producto-titulo').textContent    = 'Nuevo producto';
  document.getElementById('modal-producto-subtitulo').textContent = 'Agrega un producto al catálogo';
  cerrarModal('modal-producto');
  abrirModal('modal-producto');
}

// ============================================================
//  GUARDAR — Crear o actualizar producto
// ============================================================
async function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById('p-id').value;

  const datos = {
    nombre:      document.getElementById('p-nombre').value.trim(),
    descripcion: document.getElementById('p-descripcion').value.trim(),
    precio:      parseFloat(document.getElementById('p-precio').value),
    stock:       parseInt(document.getElementById('p-stock').value),
    categoria:   document.getElementById('p-categoria').value
  };

  try {
    const url    = id ? `${API_BASE}/productos/${id}` : `${API_BASE}/productos`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(datos)
    });

    const respuesta = await res.json();

    if (!res.ok) {
      toast(`❌ ${respuesta.mensaje || 'Error al guardar'}`, 'error');
      return;
    }

    cerrarModal('modal-producto');
    cargarProductos();
    toast(id ? '✅ Producto actualizado exitosamente' : '✅ Producto creado exitosamente');

  } catch {
    toast('❌ Error de conexión con el servidor', 'error');
  }
}

// ============================================================
//  EDITAR — Cargar datos del producto en el modal
// ============================================================
async function editarProducto(id) {
  try {
    const res       = await fetch(`${API_BASE}/productos/${id}`);
    const respuesta = await res.json();
    const p         = respuesta.datos;

    document.getElementById('modal-producto-titulo').textContent    = 'Editar producto';
    document.getElementById('modal-producto-subtitulo').textContent = `Modificando: ${p.nombre}`;

    document.getElementById('p-id').value          = p._id;
    document.getElementById('p-nombre').value      = p.nombre;
    document.getElementById('p-descripcion').value = p.descripcion || '';
    document.getElementById('p-precio').value      = p.precio;
    document.getElementById('p-stock').value       = p.stock;
    document.getElementById('p-categoria').value   = p.categoria;

    abrirModal('modal-producto');

  } catch {
    toast('❌ No se pudo cargar el producto', 'error');
  }
}

// ============================================================
//  ELIMINAR — Confirmar y borrar producto
// ============================================================
async function eliminarProducto(id, nombre) {
  if (!confirm(`¿Eliminar el producto "${nombre}"?\nEsta acción no se puede deshacer.`)) return;

  try {
    const res = await fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      toast('❌ Error al eliminar el producto', 'error');
      return;
    }

    cargarProductos();
    toast(`🗑 Producto "${nombre}" eliminado`);

  } catch {
    toast('❌ Error de conexión con el servidor', 'error');
  }
}
