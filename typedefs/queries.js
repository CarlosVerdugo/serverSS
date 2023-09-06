export default `#graphql

  type Query {
    user(email: String!): User
    logIn(email: String!, password: String!): User
    users: [User!]
    actividades(fono: String!, obj: Int): [Actividad!]
    actividad(id: Int!): Actividad!
    actividadesEnCasa: [ActividadCasa!]
    actividadEnCasa(id: Int!): ActividadCasa!
    pacientes: [Paciente!]
    sesiones(rut: String!): [Sesion]
    sesion(id: Int!): Sesion!
    Objetivos: [Objetivo]
  }

`
