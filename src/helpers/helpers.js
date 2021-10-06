
// Devuelve el texto para mostrar al apoderado
export function textoEstadoDeEvaluacion(tramite, rol) {
  switch (rol) {
    case "apoderado":
      if (tramite.estado_evaluacion.includes("endiente mesa de entradas")) {
        return 'El trámite está siendo evaluado por la mesa de entradas'
      }
      else if (tramite.estado_evaluacion.includes("probado por empleado-mesa")) {
        return '¡El trámite ya fue aprobado por mesa de entradas! Ahora un escribano está evaluando el estatuto'
      }
      else if (tramite.estado_evaluacion.includes("echazado por empleado-mesa")) {
        return 'El trámite fue rechazado por la mesa de entradas. Por favor, revisá tu email para conocer los detalles'
      }
      else if (tramite.estado_evaluacion.includes("probado por escribano-area")) {
        return '¡FELICITACIONES! El trámite fue validado por el escribano y la sociedad ya fue registrada'
      }
      else if (tramite.estado_evaluacion.includes("echazado por escribano-area")) {
        return '¡FELICITACIONES! El trámite fue validado por el escribano y la sociedad ya fue registrada'
      }
      break;

    case "mesa-de-entradas":
      if (tramite.estado_evaluacion.includes("endiente mesa de entradas")) {
        return 'La solicitud está lista para evaluar'
      }
      /*
      else if (tramite.estado_evaluacion.includes("probado por empleado-mesa")) {
        return '¡El trámite ya fue aprobado por mesa de entradas! Ahora un escribano está evaluando el estatuto'
      }
      else if (tramite.estado_evaluacion.includes("echazado por empleado-mesa")) {
        return 'El trámite fue rechazado por la mesa de entradas. Por favor, revisá tu email para conocer los detalles'
      }
      else if (tramite.estado_evaluacion.includes("probado por escribano-area")) {
        return '¡FELICITACIONES! El trámite fue evaluado por el escribano y la sociedad ya fue registrada'
      }
      else if (tramite.estado_evaluacion.includes("echazado por escribano-area")) {
        return '¡FELICITACIONES! El trámite fue evaluado por el escribano y la sociedad ya fue registrada'
      }
      */
      break;

    case "escribano":
      /*
      if (tramite.estado_evaluacion.includes("endiente mesa de entradas")) {
        return 'La solicitud está lista para evaluar'
      }
      */
      if (tramite.estado_evaluacion.includes("probado por empleado-mesa")) {
        return 'La solicitud está lista para validar. El estatuto se encuentra en la url de la carpeta de Drive'
      }
      /*
      else if (tramite.estado_evaluacion.includes("echazado por empleado-mesa")) {
        return 'El trámite fue rechazado por la mesa de entradas. Por favor, revisá tu email para conocer los detalles'
      }
      else if (tramite.estado_evaluacion.includes("probado por escribano-area")) {
        return '¡FELICITACIONES! El trámite fue evaluado por el escribano y la sociedad ya fue registrada'
      }
      else if (tramite.estado_evaluacion.includes("echazado por escribano-area")) {
        return '¡FELICITACIONES! El trámite fue evaluado por el escribano y la sociedad ya fue registrada'
      }
      */
      break;
  }
  
}
