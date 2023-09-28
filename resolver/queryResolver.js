import * as md from "../models/mongoDBmodels.js";
import { hash, compare } from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { GraphQLJSON } from 'graphql-type-json';
import { GraphQLScalarType } from "graphql";

// Retrieve env vars
config()

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function parseDatestring(datestring) {
  const [date, time] = datestring.split(' ');
  const [day, month, year] = date.split('-');
  const [hour, minute] = time.split(':');
  const epochDate = new Date(year, month - 1, day, hour, minute);
  return epochDate.toISOString();
}

export default {

  JSON: GraphQLJSON,

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.toISOString(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),

  Query: {

    async users() {
      return await md.User.find().sort();
    },

    async user(_, {email}) {
      return await md.User.findOne({email: email});
    },

    async pacientes() {
      return await md.Paciente.find().sort();
    },

    async pacientesUser(_, { email }) {
      const user = await md.User.findOne({email: email});
      const pacientesUser = [];
      for (let i = 0; i < user.pacientes.length; i++) {
        const paciente = await md.Paciente.findOne({rut: user.pacientes[i]});
        pacientesUser.push(paciente)
      }
      return pacientesUser;
    },

    async actividades(_, {fono, obj}) {
      if(obj != null) {
        return await md.Actividad.find({email_usr: fono, objetivo: obj}).sort({nombre: -1});
      } else {
        return await md.Actividad.find({email_usr: fono}).sort({nombre: -1});
      }
    },

    async actividad(_, {id}) {
      return await md.Actividad.findById(id);
    },

    async actividadesEnCasa() {
      return await md.ActividadCasa.find().sort({nombre: 1});
    },

    async actividadEnCasa(_, {id}) {
      return await md.ActividadCasa.findById(id);
    },

    async sesiones(_, {rut}) {
      const paciente = await md.Paciente.findOne({rut: rut});
      const ses = [];
      for (let i = 0; i < paciente.sesiones.length; i++) {
        ses.push(await md.Sesion.findById(paciente.sesiones[i]));
      }
      return ses;
    },

    async sesion(_, {id}) {
      return await md.Sesion.findById(id);
    },

    async Objetivos() {
      return await md.Objetivo.find().sort();
    },

    async pacientesNoAsignados() {
      // Función utilizada para filtrar los pacientes que ya han sido asignados
      // a *un* cuidador o a *un* fono.
      const usuarios = await md.User.find();
      const pacientesAsignadosFonos = [];
      const pacientesAsignadosCuidadores = [];
      for (let i = 0; i < usuarios.length; i++) {
        const tipo = usuarios[i].type;
        for (let j = 0; j < usuarios[i].pacientes.length; j++) {
          if (tipo === 'F') {
            pacientesAsignadosFonos.push(usuarios[i].pacientes[j]);
          } else {
            pacientesAsignadosCuidadores.push(usuarios[i].pacientes[j]);
          }
        }
      }
      const pacientesNoAsignadosFonos = [];
      const pacientesNoAsignadosCuidadores = [];
      const pacientes = await md.Paciente.find();
      for (let i = 0; i < pacientes.length; i++) {
        const rut = pacientes[i].rut;
        if (!pacientesAsignadosFonos.includes(rut)) {
          pacientesNoAsignadosFonos.push({
            "rut": pacientes[i].rut,
            "fullName": pacientes[i].nombre_completo
          });
        } 
        if (!pacientesAsignadosCuidadores.includes(rut)) {
          pacientesNoAsignadosCuidadores.push({
            "rut": pacientes[i].rut,
            "fullName": pacientes[i].nombre_completo
          });
        }
      }

      return { 
        "pacientesSinFono": pacientesNoAsignadosFonos,
        "pacientesSinCuidador": pacientesNoAsignadosCuidadores
      };
    },
    
    async actividadesPortal(_, {tag}) {
            if(tag != null) {
                const acts = []
                for (let i = 0; i < tag.length; i++) {
                    acts.concat(await md.PortalAct.find({tag: tag[i]}));
                }
                return acts;
            } else {
                return await md.PortalAct.find().sort({_id: -1});
            }
        },
        
    async actividadPortal(_, {id}) {
        return await md.PortalAct.findById(id);
    },   

    async sesionesCalendario(_, {pacientes_arr}) {
      // Retorna todas las sesiones agendadas para los pacientes a cargo del usuario
      const events = [];
      if (!pacientes_arr.length) return events;

      for (let i = 0; i < pacientes_arr.length; i++) {
        let paciente = await md.Paciente.findOne({rut: pacientes_arr[i]});
        if (!paciente.sesiones.length) continue;

        let color_paciente = getRandomColor();
        let paciente_nombre = paciente.nombre_completo;

        for (let j = 0; j < paciente.sesiones.length; j++) {
          let sesion = await md.Sesion.findOne({_id: paciente.sesiones[j]});
          const start_date = parseDatestring(sesion.fecha_hora);
          const start_date_obj = new Date(start_date)
          const end_date_obj = new Date(start_date_obj.getTime() + sesion.duracion * 60000);
          const end_date = end_date_obj.toISOString();

          events.push({
            id: sesion.id,
            title: `Sesión ${sesion.numero} de ${paciente_nombre}`,
            color: color_paciente,
            start: start_date,
            end: end_date
          });
        }
      }
      return events;
    }
  },

  Mutation: {

    async register(_, { email, password, type, full_name, pacientes }) {
      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Create new user doc
      const res = new md.User({
        email: email,
        password: hashedPassword,
        type: type,
        full_name: full_name,
        pacientes: pacientes,
      });
      await res.save();
      return res;
    },

    async login(_, { email, password }) {
      const user = await md.User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Compare provided password with hashed password
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Sends only some attributes of User (for now)
      const res = {
        email: user.email,
        type: user.type,
        full_name: user.full_name,
        pacientes: user.pacientes
      };

      // JWT Signing with the res doc as the payload
      const token = jwt.sign({ res }, process.env.TOKEN_SECRET)

      return token;
    },

    async upUser(_, { email, updatedFields }) {
      // Busca usuario por email y actualiza sus datos
      try {
        const res = await md.User.findOneAndUpdate({email: email},
          {
            $set: updatedFields,
            updatedAt: Date.now()
          },
          {new: true});
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    async newPatient(_, { rut, nombre_completo, fecha_nacimiento, direccion, diagnostico, addFields }) {
      if (await md.Paciente.findOne({ rut })) return;

      const res = new md.Paciente({
        rut: rut,
        nombre_completo: nombre_completo,
        fecha_nacimiento: fecha_nacimiento,
        direccion: direccion,
        diagnostico: diagnostico,
        ...addFields // spread operator to parse values from addFields
      });
      await res.save();
      return res;
    },

    async upPatient(_, { rut, upFields }) {
      // Busca paciente por rut y actualiza sus datos
      try {
        const res = await md.Paciente.findOneAndUpdate({rut: rut},
          {
            $set: upFields,
            updatedAt: Date.now()
          },
          {new: true});  
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    async newObj(_, {nombre}) {
      let newId = await md.Objetivo.count();
      newId++;
      const res = new md.Objetivo({
        _id: newId,
        nombre: nombre,
      });
      await res.save();
      return res;
    },

    async autoEval(_, {actId, critId, evaluation, comentarios}) {
      const act = await md.ActividadCasa.findById(actId);
      if(comentarios != null) {
        act.$set("comentarios", comentarios);
      }
      act.criterios_exito.id(critId).$set("porcentaje_logro", evaluation);
      act.$set("evaluada", true);
      await act.save();
      return await md.ActividadCasa.findById(actId);
    },

    async newActivity(_, {actividad}) {
      let newId = await md.Actividad.count();
      newId++;
      const crits = [];
      for (let i = 0; i < actividad.criterios_exito.length; i++) {
        let cId = i + 1;
        crits.push({
          _id: newId.toString() + "-" + cId.toString(),
          nombre: actividad.criterios_exito[i],
          porcentaje_logro: 0,
        });
      }
      const res = new md.Actividad({
        _id: newId,
        email_usr: actividad.email_usr,
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        objetivo: actividad.objetivo,
        criterios_exito: crits,
        materiales: actividad.materiales,
      });
      await res.save();
      return res;
    },

    async newActCasa(_, {actividad}) {
      let newId = await md.Actividad.count();
      newId++;
      const crits = [];
      for (let i = 0; i < actividad.criterios_exito.length; i++) {
        let cId = i + 1;
        crits.push({
          _id: newId.toString() + "-" + cId.toString(),
          nombre: actividad.criterios_exito[i],
          porcentaje_logro: 0,
        });
      }
      const res = new md.ActividadCasa({
        _id: newId,
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        criterios_exito: crits,
        comentarios: "",
        fecha: actividad.fecha,
        evaluada: false,
      });
      await res.save();
      return res;
    },

    async upActivity(_, {id, actividad}) {
      const crits = [];
      for (let i = 0; i < actividad.criterios_exito.length; i++) {
        let cId = i + 1;
        crits.push({
          _id: id.toString() + "-" + cId.toString(),
          nombre: actividad.criterios_exito[i],
          porcentaje_logro: 0,
        });
      }
      const res = await md.Actividad.findByIdAndUpdate({_id: id}, {
        email_usr: actividad.email_usr,
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        objetivo: actividad.objetivo,
        criterios_exito: crits,
        materiales: actividad.materiales,
      }, {new: true});
      return res;
    },

    async newSesion(_, {sesion}) {
      let newId = await md.Sesion.count();
      newId++;
      const pas = await md.Paciente.findOne({rut: sesion.rut});
      let newNumber = pas.sesiones.length;
      newNumber++;
      const res = new md.Sesion({
        _id: newId,
        numero: newNumber,
        fecha_hora: sesion.fecha_hora,
        duracion: sesion.duracion,
        actividades: sesion.actividades,
        comentarios: sesion.comentarios,
        porcentaje_logro: 0,
        evaluada: false,
      });
      await res.save();
      let sesions = pas.sesiones;
      sesions.push(newId);
      await md.Paciente.updateOne({rut: sesion.rut}, {sesiones: sesions});
      return res;
    },

    async actEval(_, {sesionId, actId, critId, evaluation}) {
      const ses = await md.Sesion.findById(sesionId);
      ses.actividades.id(actId).criterios_exito.id(critId).$set("porcentaje_logro", evaluation);
      await ses.save();
      return await md.Sesion.findById(sesionId);
    },

    async sesionEval(_, {id, evaluation, comment}) {
      if(comment != null) {
        await md.Sesion.updateOne({_id: id}, {porcentaje_logro: evaluation, comentarios: comment, evaluada: true});
        return await md.Sesion.findById(id);
      } else {
        await md.Sesion.updateOne({_id: id}, {porcentaje_logro: evaluation, evaluada: true});
        return await md.Sesion.findById(id);
      }
    },

    async reagendar(_, {id, fecha}) {
      await md.Sesion.updateOne({_id: id}, {fecha_hora: fecha});
      return await md.Sesion.findById(id);
    },

    async uploadAct(_, {actividad}) {
            let newId = await md.PortalAct.count();
            newId++;
            const res = new md.PortalAct({
                _id: newId,
                nombre: actividad.nombre,
                descripcion: actividad.descripcion,
                objetivo: actividad.objetivo,
                criterios_exito: actividad.criterios_exito,
                materiales: actividad.materiales,
                tag: actividad.tag,
            });
            await res.save();
            return res;
    }
  },

};
