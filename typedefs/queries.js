export default `#graphql

  type Query {
    user(email: String!): User
    users: [User!]
    actividades(fono: String!, obj: Int): [Actividad!]
    actividad(id: Int!): Actividad!
    actividadesEnCasa: [ActividadCasa!]
    actividadEnCasa(id: Int!): ActividadCasa!
    pacientes: [Paciente]
    pacientesUser(email: String!): [Paciente]
    sesiones(rut: String!): [Sesion]
    sesion(id: Int!): Sesion!
    Objetivos: [Objetivo]
    actividadesPortal(tag: [String]): [PortalAct!]
    actividadPortal(id: Int!): PortalAct
    pacientesNoAsignados: JSON!
    sesionesCalendario(pacientes_arr: [String]): [EventoCalendario]
    primerIngreso(user: String!): Tutorial
    getNotifications(recipientId: ID!): [Notificacion]
  }

`
