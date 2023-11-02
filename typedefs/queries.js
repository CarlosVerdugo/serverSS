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
    documentosPortal(tag: [String]): [PortalDoc!]
    documentoPortal(id: Int!): PortalDoc
    pacientesNoAsignados: JSON!
    sesionesCalendario(pacientes_arr: [String]): [EventoCalendario]
    primerIngreso(user: String!): Tutorial
    getNotifications(recipientId: ID!): [Notificacion]
    getTodaySesionFechaHora(sesionesIds: [Int!]): String
  }

`
