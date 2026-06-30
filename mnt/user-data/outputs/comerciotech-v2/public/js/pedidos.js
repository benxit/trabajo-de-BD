
async function cargarPedidos() {
  const tbody = document.getElementById('tabla-pedidos');
  tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">⏳</div><div class="empty-state__text">Cargando pedidos...</div></div></td></tr>`;

  try {
    const res       = await fetch(`${API_BASE}/pedidos`);
    const respuesta = await res.json();
    const pedidos   = respuesta.datos;

    // Actualizar contadores
    document.getElementById('count-pedidos').textContent  = pedidos.length;
    document.getElementById('metric-pedidos').textContent = pedidos.length;

    if (pedidos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">🛒</div><div class="empty-state__text">No hay pedidos registrados aún</div></div></td></tr>`;
      return;
    }

    tbody.innerHTML = pedidos.map(p => `
      <tr>
        <td class="td-mono" style="font-size:11px">#${p._id.slice(-8).toUpperCase()}</td>
        <td>
          <strong>${p.cliente_id?.nombre || 'Cliente eliminado'}</strong>
          <div style="font-size:11px;color:var(--color-muted);margin-top:2px">${p.cliente_id?.email || ''}</div>
        </td>
        <td class="td-mono">${formatFecha(p.fecha_pedido)}</td>
        <td>${badgeEstado(p.estado)}</td>
        <td class="td-mono"><strong>${formatPrecio(p.total)}</strong></td>
        <td>
          <div class="td-actions">
            <button class="btn btn--edit"   onclick="editarPedido('${p._id}')">✏ Estado</button>
            <button class="btn btn--danger" onclick="eliminarPedido('${p._id}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

  } catch {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon">❌</div><div class="empty-state__text">No se pudo conectar con el servidor</div></div></td></tr>`;
  }
}


//  AUXILIAR — Poblar select de clientes en el modal

async function cargarClientesEnSelect() {
  const sel = document.getElementById('ped-cliente');
  sel.innerHTML = '<option value="">Cargando clientes...</option>';

  try {
    const res       = await fetch(`${API_BASE}/clientes`);
    const respuesta = await res.json();
    const clientes  = respuesta.datos;

    sel.innerHTML = '<option value="">Seleccionar cliente</option>' +
      clientes.map(c => `<option value="${c._id}">${c.nombre} — ${c.email}</option>`).join('');

  } catch {
    sel.innerHTML = '<option value="">Error al cargar clientes</option>';
  }
}


//  CREAR — Abrir modal vacío

async function abrirModalPedido() {
  document.getElementById('modal-pedido-titulo').textContent    = 'Nuevo pedido';
  document.getElementById('modal-pedido-subtitulo').textContent = 'Registra una nueva orden de compra';
  cerrarModal('modal-pedido');
  await cargarClientesEnSelect();
  abrirModal('modal-pedido');
}


//  GUARDAR — Crear o actualizar pedido

async function guardarPedido(e) {
  e.preventDefault();
  const id = document.getElementById('ped-id').value;

  const datos = {
    cliente_id: document.getElementById('ped-cliente').value,
    estado:     document.getElementById('ped-estado').value,
    total:      parseFloat(document.getElementById('ped-total').value),
    detalles:   []   // gestionado directamente en MongoDB para este panel
  };

  try {
    const url    = id ? `${API_BASE}/pedidos/${id}` : `${API_BASE}/pedidos`;
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

    cerrarModal('modal-pedido');
    cargarPedidos();
    toast(id ? '✅ Pedido actualizado exitosamente' : '✅ Pedido creado exitosamente');

  } catch {
    toast('❌ Error de conexión con el servidor', 'error');
  }
}


//  EDITAR — Cargar datos del pedido en el modal

async function editarPedido(id) {
  try {
    const res       = await fetch(`${API_BASE}/pedidos/${id}`);
    const respuesta = await res.json();
    const p         = respuesta.datos;

    document.getElementById('modal-pedido-titulo').textContent    = 'Editar pedido';
    document.getElementById('modal-pedido-subtitulo').textContent = `Modificando pedido #${id.slice(-8).toUpperCase()}`;

    await cargarClientesEnSelect();

    document.getElementById('ped-id').value      = p._id;
    document.getElementById('ped-cliente').value = p.cliente_id?._id || p.cliente_id;
    document.getElementById('ped-estado').value  = p.estado;
    document.getElementById('ped-total').value   = p.total;

    abrirModal('modal-pedido');

  } catch {
    toast('❌ No se pudo cargar el pedido', 'error');
  }
}


//  ELIMINAR — Confirmar y borrar pedido

async function eliminarPedido(id) {
  if (!confirm(`¿Eliminar el pedido #${id.slice(-8).toUpperCase()}?\nEsta acción no se puede deshacer.`)) return;

  try {
    const res = await fetch(`${API_BASE}/pedidos/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      toast('❌ Error al eliminar el pedido', 'error');
      return;
    }

    cargarPedidos();
    toast('🗑 Pedido eliminado');

  } catch {
    toast('❌ Error de conexión con el servidor', 'error');
  }
}
