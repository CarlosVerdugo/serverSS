export default `#graphql

  type Mutation {
    # Crear de usuario
    newUser(usr: newUsr!): User
    # Crear objetivo
    newObj(nombre: String!): Objetivo
    # Autoevaluacion
    autoEval(actId: Int!, critId: Int!, evaluacion: Float!, comentarios: String): ActividadCasa
    # Crear actividades
    newActivity(actividad: newAct): Actividad
    # Crear sesion
    newSesion(sesion: newSes): Sesion
    # Evaluar sesion
    actEval(sesionId: Int!, actId: Int!, critId: Int!, evaluation: Float!): Sesion
    sesionEval(id: Int!, evaluation: Float!, comment: String): Sesion
  }

`
