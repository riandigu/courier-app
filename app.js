function obtenerHorario() {
  const h = new Date().getHours();

  if (h >= 7 && h <= 9) return "PUNTA AM";
  if (h > 9 && h <= 14) return "INTERMEDIO";
  if (h > 14 && h <= 17) return "VALLE";
  if (h > 17 && h <= 20) return "PUNTA PM";

  return "FUERA HORARIO";
}

function calcularTarifa(horario) {
  let valorKm = 700;
  let fijo = 2000;

  if (horario === "PUNTA PM") fijo = 3000;

  return { valorKm, fijo };
}

function guardar() {

  const data = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    cliente: document.getElementById("cliente").value,

    remitente: document.getElementById("remitente").value,
    tel_rem: document.getElementById("tel_rem").value,
    dir_rem: document.getElementById("dir_rem").value,

    destinatario: document.getElementById("destinatario").value,
    tel_dest: document.getElementById("tel_dest").value,
    dir_dest: document.getElementById("dir_dest").value,

    distancia: parseFloat(document.getElementById("distancia").value),
    tipo: document.getElementById("tipo").value,
    obs: document.getElementById("obs").value
  };

  data.horario = obtenerHorario();

  const tarifa = calcularTarifa(data.horario);

  data.valorKm = tarifa.valorKm;
  data.fijo = tarifa.fijo;

  data.subtotal = (data.distancia * data.valorKm) + data.fijo;
  data.iva = Math.round(data.subtotal * 0.19);
  data.total = Math.round(data.subtotal + data.iva);

  // Guardar historial
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.push(data);
  localStorage.setItem("registros", JSON.stringify(registros));

  generarCSV(registros);

  localStorage.setItem("ticket", JSON.stringify(data));

  window.open("print.html");
}

function generarCSV(registros) {
  let csv = "ID,Fecha,Cliente,Remitente,Destinatario,Distancia,Tipo,Total\n";

  registros.forEach(r => {
    csv += `${r.id},${r.fecha},${r.cliente},${r.remitente},${r.destinatario},${r.distancia},${r.tipo},${r.total}\n`;
  });

  localStorage.setItem("csv", csv);
}

function descargarCSV() {
  const csv = localStorage.getItem("csv");
  const blob = new Blob([csv], { type: "text/csv" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "registros.csv";
  a.click();
}