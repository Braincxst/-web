document.addEventListener("DOMContentLoaded", () => {
  cargarTareas();
});

function obtenerIcono(categoria) {
  const iconos = {
    "Personal": "👤",
    "Trabajo": "💼",
    "Estudio": "📚",
    "Otro": "🗂️"
  };
  return iconos[categoria] || "📝";
}

function cargarTareas() {
  fetch("/api/tareas")
    .then(res => res.json())
    .then(tareas => {
      const lista = document.getElementById("lista-tareas");
      const filtro = document.getElementById("filtro-estado").value;
      lista.innerHTML = "";

      const tareasFiltradas = tareas.filter(t => {
        if (filtro === "todos") return true;
        if (filtro === "completados") return t.completado;
        if (filtro === "pendientes") return !t.completado;
      });

      document.getElementById("contador-tareas").textContent = `Tareas: ${tareasFiltradas.length}`;

      tareasFiltradas.forEach(tarea => {
        const li = document.createElement("li");

        li.innerHTML = `
          <span onclick="marcarCompletada(${tarea.id})" style="cursor: pointer; ${tarea.completado ? 'text-decoration: line-through; color: #aaa;' : ''}">
            ${obtenerIcono(tarea.categoria)} ${tarea.titulo}
            ${tarea.vencimiento ? `<small style="display:block; color: #ccc; font-size: 13px;">📅 ${tarea.vencimiento}</small>` : ""}
          </span>
          <div>
            <button class="trash-btn" onclick="eliminarTarea(${tarea.id})">
              <div class="trash-can">
                <div class="lid"></div>
                <div class="body"></div>
              </div>
            </button>
          </div>
        `;

        lista.appendChild(li);
      });
    });
}

function agregarTarea() {
  const titulo = document.getElementById("tarea").value.trim();
  const vencimiento = document.getElementById("vencimiento").value;
  const categoria = document.getElementById("categoria").value;

  if (!titulo) return;

  fetch("/api/tareas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titulo, vencimiento, categoria })
  })
    .then(res => res.json())
    .then(() => {
      ocultarFormulario();
      cargarTareas();
    });
}

function marcarCompletada(id) {
  fetch(`/api/tareas/${id}`, {
    method: "PATCH"
  })
    .then(res => res.json())
    .then(() => cargarTareas());
}

function eliminarTarea(id) {
  fetch(`/api/tareas/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => cargarTareas());
}

function mostrarFormulario() {
  document.getElementById("formulario-tarea").style.display = "flex";
}

function ocultarFormulario() {
  document.getElementById("formulario-tarea").style.display = "none";
  document.getElementById("tarea").value = "";
  document.getElementById("vencimiento").value = "";
  document.getElementById("categoria").value = "Personal";
}
