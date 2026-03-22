function get(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

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

  const distancia = parseFloat(get("distancia")) || 0;
  const tag = parseFloat(get("tag")) || 0;

  if (distancia <= 0) {
    alert("Ingrese distancia válida");
    return;
  }

  const data = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),

    cliente: get("id_cliente"),

    // REMITENTE
    remitente: get("remitente"),
    rut_rem: get("rut_rem"),
    tel_rem: get("tel_rem"),
    cel_rem: get("cel_rem"),
    dir_rem: get("dir_rem"),
    com_rem: get("com_rem"),
    region_rem: get("region_rem"),
    obs_rem: get("obs_rem"),

    // DESTINATARIO
    destinatario: get("destinatario"),
    rut_des: get("rut_des"),
    tel_des: get("tel_des"),
    cel_des: get("cel_des"),
    dir_des: get("dir_des"),
    com_des: get("com_des"),
    region_des: get("region_des"),
    obs_des: get("obs_des"),

    // ENVÍO
    tipo_envio: get("tipo_envio"),
    tipo: get("tipo"),
    distancia: distancia,
    tiempo: get("tiempo"),
    tag: tag,

    obs: get("obs")
  };

  data.horario = obtenerHorario();

  const tarifa = calcularTarifa(data.horario);

  data.valorKm = tarifa.valorKm;
  data.fijo = tarifa.fijo;

  data.subtotal = (data.distancia * data.valorKm) + data.fijo + data.tag;
  data.iva = Math.round(data.subtotal * 0.19);
  data.total = Math.round(data.subtotal + data.iva);

  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.push(data);
  localStorage.setItem("registros", JSON.stringify(registros));

  generarCSV(registros);

  localStorage.setItem("ticket", JSON.stringify(data));

  window.open("print.html", "_blank");
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

  if (!csv) {
    alert("No hay datos");
    return;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "registros.csv";
  a.click();
}