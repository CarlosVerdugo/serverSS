import * as md from "../models/mongoDBmodels.js";

export default {

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
        async logIn(_, {email, password}) {
            return await md.User.findOne({email: email, password: password});
        },
        async Objetivos() {
            return await md.Objetivo.find().sort();
        }
    },

    Mutation: {
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
            }else {
                await md.Sesion.updateOne({_id: id}, {porcentaje_logro: evaluation, evaluada: true});
                return await md.Sesion.findById(id);
            }
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
        async newUser(_, {usr}) {
            const res = new md.User({
                email: usr.email_usr,
                password: usr.password,
                type: usr.type,
                full_name: usr.full_name,
                pacientes: usr.pacientes,
            });
            await res.save();
            return res;
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
        }
    },

};