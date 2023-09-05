export default `#graphql

  # Inputs

  input LoginInput {
    email: String!
    password: String!
  }

  input newAct {
    email_usr: String!
    nombre: String!
    descripcion: String!
    objetivo: Int!
    criterios_exito: [String!]
    materiales: [String]
  }

  input newSes {
    fecha_hora: String!
    duracion: Int!
    actividades: [Int!]
    comentarios: String
    rut: String!
  }

  input newUsr {
    email: String!
    password: String!
    type: String!
    full_name: String!
    pacientes: [String]
  }

  # Outputs

  type LoginResult {
    auth: Boolean!
    mensaje: String
  }
`
