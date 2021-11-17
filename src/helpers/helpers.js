import env from "@beam-australia/react-env"

// Devuelve el texto para mostrar al apoderado
export function textoEstadoDeEvaluacion(tramite, rol) {
  switch (rol) {
    case env("ROL_APODERADO"):
      if (tramite.estado_evaluacion.includes("endiente mesa de entradas")) {
        return 'El trámite está siendo evaluado por la mesa de entradas'
      }
      else if (tramite.estado_evaluacion.includes("probado por empleado-mesa")) {
        return '¡El trámite ya fue aprobado por mesa de entradas! Ahora un escribano está evaluando el estatuto'
      }
      else if (tramite.estado_evaluacion.includes("statuto corregido por apoderado")) {
        return '¡Perfecto! Ya actualizaste el estatuto. Nuevamente, un escribano lo evaluará y ' +
          'te notificará por email ante cualquier novedad'
      }
      else if (tramite.estado_evaluacion.includes("echazado por empleado-mesa")) {
        return 'El trámite fue rechazado por la mesa de entradas. Por favor, revisá tu email para conocer los detalles. ' +
          'Cuando ya sepas qué datos tenés que corregir, hacé click en "Corregir solicitud"'
      }
      else if (tramite.estado_evaluacion.includes("probado por escribano-area")) {
        return 'El trámite fue aprobado por el área de legales. \
        Ahora solo falta preparar la carpeta física y digital. \
        Por favor, revisá tu email para conocer los detalles.'
      }
      else if (tramite.estado_evaluacion.includes("echazado por escribano-area")) {
        return 'El estatuto fue rechazado por el escribano. Por favor, revisá tu email para conocer los detalles. ' +
          'Cuando ya sepas qué datos corregir, hacé click en "Actualizar estatuto"'
      }
      else if (tramite.estado_evaluacion.includes("ociedad registrada")) {
        return '¡FELICITACIONES! La sociedad ahora se encuentra registrada'
      }
      break;

    case env("ROL_MESA_ENTRADAS"):
      if (tramite.estado_evaluacion.includes("endiente mesa de entradas")) {
        return 'La solicitud está lista para evaluar'
      }
      else if (tramite.estado_evaluacion.includes("probado por escribano-area")) {
        return 'La solicitud fue aprobada por un escribano y ya se puede crear la carpeta física'
      }
      break;

    case env("ROL_LEGALES"):
      if (tramite.estado_evaluacion.includes("probado por empleado-mesa")) {
        return 'La solicitud está lista para validar. El estatuto se encuentra en la carpeta de Drive referenciada más abajo'
      }
      else if (tramite.estado_evaluacion.includes("statuto corregido por apoderado")) {
        return 'El apoderado ha actualizado el estatuto por pedido de un escribano y la solicitud está nuevamente lista para validar. ' +
          'El estatuto se encuentra en la carpeta de Drive referenciada más abajo'
      }
      break;
  }

}

export function valorYColorLineaProgreso(estado) {
  // Son 6 estados posibles por los que puede pasar el trámite
  let cantPorEstado = 100 / 6;
  switch (estado) {
    case "Rechazado por empleado-mesa-de-entradas":
      return {
        valor: cantPorEstado,
        color: { string: "warning", hexa: '#e77200' }
      }
    case "Pendiente mesa de entradas":
      return {
        valor: cantPorEstado * 2,
        color: { string: "secondary", hexa: '#4378d4' }
      }
    case "Rechazado por escribano-area-legales":
      return {
        valor: cantPorEstado * 3,
        color: { string: "warning", hexa: '#e77200' }
      }
    case "Aprobado por empleado-mesa-de-entradas":
      return {
        valor: cantPorEstado * 4,
        color: { string: "secondary", hexa: '#4378d4' }
      }
    case "Estatuto corregido por apoderado":
      return {
        valor: cantPorEstado * 4,
        color: { string: "secondary", hexa: '#4378d4' }
      }
    case "Aprobado por escribano-area-legales":
      return {
        valor: cantPorEstado * 5,
        color: { string: "secondary", hexa: '#4378d4' }
      };
    case "Sociedad registrada":
      return {
        valor: cantPorEstado * 6,
        color: { string: "primary", hexa: '#4ebc58' }
      };
  }
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function setearCookies(data) {
  document.cookie = "X-Bonita-API-Token=" + data.auth['X-Bonita-API-Token'];
  document.cookie = "JSESSIONID=" + data.auth.JSESSIONID;
  document.cookie = "access_token=" + data.auth.access_token;
  document.cookie = "name=" + data.user.name;
  document.cookie = "email=" + data.user.email;
  document.cookie = "rol=" + data.user.roles[0];
}

export function userLogueado() {
  return (getCookie("name")) ? true : false
}

export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}