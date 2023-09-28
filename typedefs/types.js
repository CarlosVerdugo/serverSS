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

  type Sesion {
    id: Int!
    numero: Int!
    fecha_hora: String!
    duracion: Int!
    actividades: [Int!]
    comentarios: String
    porcentaje_logro: Float
    evaluada: Boolean!
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
    diagnostico: String!,
    sesiones: [Int]
    actividades_casa: [Int]
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
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

`
