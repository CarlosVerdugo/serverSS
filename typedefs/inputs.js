export default `#graphql

  # Inputs

  input LoginInput {
    email: String!
    password: String!
  }

  input newUsr {
    email: String!
    password: String!
    type: String!
    full_name: String!
    pacientes: [String]
  }

  input newAct {
    email_usr: String!
    nombre: String!
    descripcion: String!
    objetivo: Int!
    criterios_exito: [String!]
    materiales: [String]
  }

  input newActividadCasa {
    nombre: String!
    descripcion: String!
    criterios_exito: [String!]
    fecha: String
  }

  input newSes {
    fecha_hora: String!
    duracion: Int!
    actividades: [Int!]
    comentarios: String
    rut: String!
  }
  
  input newPaciente {
    rut: String!
    nombre_completo: String!
    fecha_nacimiento: Date!
    edad: Int!
    curso: String!
    direccion: String!
    diagnostico: String!,
    sesiones: [Int!]
    actividades_casa: [Int!]
  }

  input newPortalAct {
    nombre: String!
    descripcion: String!
    objetivo: Int!
    criterios_exito: [String!]
    materiales: [String]
    tag: [String!]
  }

  input newPortalDoc {
    user_name: String!
    user_mail: String!
    link: String!
    nombre: String!
    descripcion: String
    tag: [String!]
  }

  # Outputs

  type LoginResult {
    auth: Boolean!
    mensaje: String
  }
`
