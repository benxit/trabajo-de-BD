
async function cargarClientes() {
  const tbody = document.getElementById('tabla-clientes');
  tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">⏳</div><div class="empty-state__text">Cargando clientes...</div></div></td></tr>`;

  try {
    const res      = await fetch(`${API_BASE}/clientes`);
    const respuesta = await res.json();
    const clientes  = respuesta.datos;

    // Actualizar contador en la pestaña
    document.getElementById('count-clientes').textContent = clientes.length;
    document.getElementById('metric-clientes').textContent = clientes.length;

    if (clientes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">👤</div><div class="empty-state__text">No hay clientes registrados aún</div></div></td></tr>`;
      return;
    }

    // Renderizar filas de la tabla
    tbody.innerHTML = clientes.map(c => `
      <tr>
        <td>
          <strong>${c.nombre}</strong>
          <div style="font-size:11px;color:var(--color-muted);margin-top:2px">${formatFecha(c.fecha_registro)}</div>
        </td>
        <td style="color:var(--color-accent)">${c.email}</td>
        <td class="td-mono">${c.telefono}</td>
        <td>${c.direccion?.calle || '—'}</td>
        <td>${c.direccion?.ciudad || '—'}, ${c.direccion?.pais || '—'}</td>
        <td>
          <div class="td-actions">
            <button class="btn btn--edit"   onclick="editarCliente('${c._id}')">✏ Editar</button>
            <button class="btn btn--danger" onclick="eliminarCliente('${c._id}', '${c.nombre}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

  } catch {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">❌</div><div class="empty-state__text">No se pudo conectar con el servidor</div></div></td></tr>`;
  }
}


//  CREAR — Abrir modal vacío
function abrirModalCliente() {
  document.getElementById('modal-cliente-titulo').textContent = 'Nuevo cliente'; 
  document.getElementById('modal-cliente-subtitulo').textContent = 'Completa los datos del cliente';
  cerrarModal('modal-cliente');
  abrirModal('modal-cliente');
}


//  GUARDAR — Crear o actualizar cliente según si hay ID

async function guardarCliente(e) {
  e.preventDefault();
  const id = document.getElementById('c-id').value;

  const datos = {
    nombre:   document.getElementById('c-nombre').value.trim(),
    email:    document.getElementById('c-email').value.trim(),
    telefono: document.getElementById('c-telefono').value.trim(),
    direccion: {
      calle:  document.getElementById('c-calle').value.trim(),
      ciudad: document.getElementById('c-ciudad').value.trim(),
      pais:   document.getElementById('c-pais').value.trim()
    }
  };
  // Validación básica de campos requeridos
  try {
    const url    = id ? `${API_BASE}/clientes/${id}` : `${API_BASE}/clientes`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(datos)
    });
    // Obtener la respuesta JSON del servidor
    const respuesta = await res.json();

    if (!res.ok) {
      toast(`❌ ${respuesta.mensaje || 'Error al guardar'}`, 'error');
      return;
    }

    cerrarModal('modal-cliente');
    cargarClientes();
    toast(id ? '✅ Cliente actualizado exitosamente' : '✅ Cliente creado exitosamente');

  } catch {
    toast('❌ Error de conexión con el servidor', 'error');
  }
}


//  EDITAR — Cargar datos del cliente en el modal

async function editarCliente(id) {
  try {
    const res       = await fetch(`${API_BASE}/clientes/${id}`);
    const respuesta = await res.json();
    const c         = respuesta.datos;

    document.getElementById('modal-cliente-titulo').textContent    = 'Editar cliente';
    document.getElementById('modal-cliente-subtitulo').textContent = `Modificando: ${c.nombre}`;

    document.getElementById('c-id').value       = c._id;
    document.getElementById('c-nombre').value   = c.nombre;
    document.getElementById('c-email').value    = c.email;
    document.getElementById('c-telefono').value = c.telefono;
    document.getElementById('c-calle').value    = c.direccion?.calle  || '';
    document.getElementById('c-ciudad').value   = c.direccion?.ciudad || '';
    document.getElementById('c-pais').value     = c.direccion?.pais   || '';

    abrirModal('modal-cliente');

  } catch {
    toast('❌ No se pudo cargar el cliente', 'error');
  }
}


//  ELIMINAR — Confirmar y borrar cliente

async function eliminarCliente(id, nombre) {
  if (!confirm(`¿Eliminar al cliente "${nombre}"?\nEsta acción no se puede deshacer.`)) return;

  try {
    const res = await fetch(`${API_BASE}/clientes/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      toast('❌ Error al eliminar el cliente', 'error');
      return;
    }

    cargarClientes();
    toast(`🗑 Cliente "${nombre}" eliminado`);

  } catch {
    toast('❌ Error de conexión con el servidor', 'error');
  }
}
