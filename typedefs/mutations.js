export default `#graphql

  type Mutation {
    # Users logic
    register(email: String!, password: String!, type: String!, full_name: String!, pacientes: [String]): User!
    login(email: String!, password: String!): String!
    upUser(email: String!, updatedFields: JSON!): User
    
    # Patients logic
    newPatient(rut: String!, nombre_completo: String!, fecha_nacimiento: Date!, direccion: String!, diagnostico: String!, addFields: JSON): Paciente
    upPatient(rut: String!, upFields: JSON!): Paciente
    
    # Crear objetivo
    newObj(nombre: String!): Objetivo
    
    # Autoevaluacion
    autoEval(actId: Int!, critId: String!, evaluation: Float!, comentarios: String): ActividadCasa
    
    # Crear actividades
    newActivity(actividad: newAct): Actividad
    
    # Crear actividades en casa
    newActCasa(actividad: newActividadCasa): ActividadCasa
    
    # Actualizar actividad
    upActivity(id: Int!, actividad: newAct): Actividad
    
    # Crear sesion
    newSesion(sesion: newSes): Sesion
    
    # Evaluar sesion
    actEval(sesionId: Int!, actId: Int!, critId: String!, evaluation: Float!): Sesion
    sesionEval(id: Int!, evaluation: Float!, comment: String): Sesion
    # Reagendar sesion
    reagendar(id: Int!, fecha: String!): Sesion
    # Subir actividades al portal
    uploadAct(actividad: newPortalAct): PortalAct
    # Marcar primer ingreso
    firstTime(user: String!): Tutorial

    # Notifications logic
    newNotification(recipient: ID!, sender: ID!, message: String!, fechaHoraSesion: String): Notificacion
    setReadNotification(notifId: ID!): Boolean!
  }

`
