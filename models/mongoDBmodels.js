import mongoose, { model, Schema } from "mongoose"

const User_sch = new Schema({
    email: String,
    password: String,
    type: String,
    full_name: String,
    pacientes: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {collection: 'usuarios', versionKey: false});

const Notificacion_sch = new Schema({
    recipientUserName: String,
    recipientUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    senderUserName: String,
    senderUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    fechaHoraSesion: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
}, {collection: 'notificaciones', versionKey: false});

const CriterioExito_sch = new Schema({
    _id: String,
    nombre: String,
    porcentaje_logro: Number
}, {autoCreate: false});

const Objetivo_sch = new Schema({
    _id: Number,
    nombre: String,
}, {collection: 'objetivos', versionKey: false});

const Actividad_sch = new Schema({
    _id: Number,
    email_usr: String,
    nombre: String,
    descripcion: String,
    objetivo: Number,
    criterios_exito: [CriterioExito_sch],
    materiales: [String]
}, {collection: 'actividades', versionKey: false});

const ActividadCasa_sch = new Schema({
    _id: Number,
    nombre: String,
    descripcion: String,
    criterios_exito: [CriterioExito_sch],
    comentarios: String,
    fecha: String,
    evaluada: Boolean
}, {collection: 'actividades_casa', versionKey: false});

const Sesion_sch = new Schema({
    _id: Number,
    numero: Number,
    fecha_hora: String,
    duracion: Number,
    actividades: [Number],
    comentarios: String,
    porcentaje_logro: Number,
    evaluada: Boolean
}, {collection: 'sesiones', versionKey: false});

const Paciente_sch = new Schema({
    rut: String,
    nombre_completo: String,
    fecha_nacimiento: String,
    edad: { type: Number, default: 0},
    curso: { type: String, default: ''},
    direccion: String,
    diagnostico: String,
    sesiones: [Number],
    actividades_casa: [Number],
    createdAt: String,
    updatedAt: String,
    idFono: { type: Schema.Types.ObjectId, ref: 'User' },
    idCuid: { type: Schema.Types.ObjectId, ref: 'User' }
}, {collection: 'pacientes', versionKey: false});

const PortalAct_sch = new Schema({
    _id: Number,
    nombre: String,
    descripcion: String,
    objetivo: Number,
    criterios_exito: [String],
    materiales: [String],
    tag: [String]
}, {collection: 'portal_expertos_act', versionKey: false});

const Tutorial_sch = new Schema({
    user: String,
    first_time: Boolean,
    comments: [String]
}, {collection: 'tutorial', versionKey: false});

export const User = model("Usuario", User_sch);
export const Notificacion = model("Notificacion", Notificacion_sch);
export const CriterioExito = model("Criterio", CriterioExito_sch);
export const Objetivo = model("Objetivo", Objetivo_sch);
export const Actividad = model("Actividad", Actividad_sch);
export const ActividadCasa = model("ActividadCasa", ActividadCasa_sch);
export const Sesion = model("Sesion", Sesion_sch);
export const Paciente = model("Paciente", Paciente_sch);
export const PortalAct = model("PortalAct", PortalAct_sch);
export const Tutorial = model("Tutorial", Tutorial_sch);
