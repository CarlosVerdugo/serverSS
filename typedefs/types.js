export default `#graphql

  type CriterioExito {
    id: String!
    nombre: String!
    porcentaje_logro: Float
  }

  type Objetivo {
    id: Int!
    nombre: String!
  }

  type Actividad {
    id: Int!
    email_usr: String!
    nombre: String!
    descripcion: String!
    objetivo: Int!
    criterios_exito: [CriterioExito!]
    materiales: [String]
  }

  type ActividadCasa {
    id: Int!
    nombre: String!
    descripcion: String
    criterios_exito: [CriterioExito!]
    comentarios: String
    fecha: String
    evaluada: Boolean!
  }

  type Feedback {
    act: Int!
    criterios_exito: [CriterioExito!]
    comentarios: String
    fecha: String
    evaluada: Boolean!
  }

  type Sesion {
    id: Int!
    numero: Int!
    fecha_hora: String!
    duracion: Int!
    actividades: [Int!]
    comentarios: String
    porcentaje_logro: Float
    resumen: String
    evaluada: Boolean!
    reagendada: Boolean!
  }

  type EventoCalendario {
    id: Int!
    title: String!
    color: String!
    start: String!
    end: String!
  }

  type Paciente {
    rut: String!
    nombre_completo: String!
    fecha_nacimiento: String!
    edad: Int
    curso: String
    direccion: String!
    diagnostico: String!
    sesiones: [Int]
    actividades_casa: [Int]
    createdAt: String!
    updatedAt: String!
    idFono: ID
    idCuid: ID
  }

  type User {
    id: ID!
    email: String!
    telefono: String
    foto: String
    type: String!
    full_name: String!
    pacientes: [String]
    createdAt: Date!
    updatedAt: Date!
  }  

  type PortalAct {
    id: Int!
    nombre: String!
    descripcion: String!
    objetivo: Int!
    criterios_exito: [String!]
    materiales: [String]
    tag: [String!]
  }

  type PortalDoc {
    id: Int!
    user_name: String!
    user_mail: String!
    link: String!
    nombre: String!
    descripcion: String
    tag: [String!]
  }

  type Tutorial {
    user: String!
    first_time: Boolean
    comments: [String]
  }

  type Notificacion {
    id: ID!
    recipientUserName: String!
    recipientUserId: ID!
    senderUserName: String!
    senderUserId: ID!
    patientName: String
    message: String!
    fechaHoraSesion: String
    timestamp: Date!
    isRead: Boolean!
  }

`
