import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PersonaEntity } from '../../personas/infraestructura/entidades/persona.entity';
import { HistorialCambiosEntity } from '../infraestructura/entidades/historial-cambios.entity';
import { HistorialSincronizacionEntity } from '../infraestructura/entidades/historial-sincronizacion.entity';
import { ConflictoEntity } from '../infraestructura/entidades/conflicto.entity';
import { UsuarioEntity } from '../../autenticacion/infraestructura/entidades/usuario.entity';
import {
  SyncRequestDto,
  SyncResponseDto,
  PersonaSyncDto,
  SyncResultadoItem,
} from '../dominio/dto/sync.dto';

const CAMPOS_PERMITIDOS: (keyof PersonaSyncDto)[] = [
  'direccion',
  'barrio',
  'estrato',
  'correo',
  'estado_civil',
  'id_eps',
  'eps_otro_nombre',
  'telefono1',
  'telefono2',
  'telefono3',
];

@Injectable()
export class SincronizacionService {
  constructor(
    @InjectRepository(PersonaEntity)
    private personaRepo: Repository<PersonaEntity>,
    @InjectRepository(HistorialCambiosEntity)
    private historialCambiosRepo: Repository<HistorialCambiosEntity>,
    @InjectRepository(HistorialSincronizacionEntity)
    private historialSyncRepo: Repository<HistorialSincronizacionEntity>,
    @InjectRepository(ConflictoEntity)
    private conflictoRepo: Repository<ConflictoEntity>,
    private dataSource: DataSource,
  ) {}

  async sincronizar(dto: SyncRequestDto, usuarioId: number): Promise<SyncResponseDto> {
    const inicio = Date.now();
    let nuevos = 0;
    let actualizados = 0;
    let sinCambios = 0;
    let errores = 0;
    const detalles: SyncResultadoItem[] = [];

    // Crear un registro inicial de sincronización para obtener el ID único
    const syncLog = await this.historialSyncRepo.save({
      id_usuario: usuarioId,
      fecha_fin: new Date(),
      duracion_ms: 0,
      cantidad_registros: dto.registros.length,
      registros_nuevos: 0,
      registros_actualizados: 0,
      registros_sin_cambios: 0,
      registros_error: 0,
      estado: 'PROCESANDO',
      observaciones: '',
    });
    const syncId = syncLog.id;

    for (const registro of dto.registros) {
      const resultado = await this._procesarRegistro(registro, usuarioId, syncId);
      detalles.push(resultado);
      if (resultado.accion === 'INSERT') nuevos++;
      else if (resultado.accion === 'UPDATE') actualizados++;
      else if (resultado.accion === 'SIN_CAMBIOS') sinCambios++;
      else errores++;
    }

    const tiempo_ms = Date.now() - inicio;
    const total_procesados = dto.registros.length;

    // Actualizar el resumen en HistorialSincronizacion
    await this.historialSyncRepo.update(syncId, {
      fecha_fin: new Date(),
      duracion_ms: tiempo_ms,
      registros_nuevos: nuevos,
      registros_actualizados: actualizados,
      registros_sin_cambios: sinCambios,
      registros_error: errores,
      estado: errores > 0 && nuevos + actualizados + sinCambios === 0 ? 'ERROR' : 'COMPLETADO',
      observaciones: JSON.stringify(detalles.filter(d => d.accion === 'ERROR').map(d => d.error)),
    });

    return { total_procesados, nuevos, actualizados, sin_cambios: sinCambios, errores, tiempo_ms, detalles };
  }

  private async _procesarRegistro(
    registro: PersonaSyncDto,
    usuarioId: number,
    syncId: number,
  ): Promise<SyncResultadoItem> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const existente = await qr.manager.findOne(PersonaEntity, {
        where: { numero_documento: registro.numero_documento },
        lock: { mode: 'pessimistic_write' },
      });

      if (!existente) {
        // ─── INSERT ─────────────────────────────────────────────────────────
        const nueva = qr.manager.create(PersonaEntity, {
          ...registro,
          estado: registro.estado || 'Activo',
          estado_sincronizacion: 'SYNCED',
          version_persona: 1,
          ultimo_editor_id: usuarioId,
        } as any);
        await qr.manager.save(nueva);

        await qr.manager.save(HistorialCambiosEntity, {
          numero_documento: registro.numero_documento,
          id_usuario: usuarioId,
          campo_modificado: 'REGISTRO_NUEVO',
          valor_anterior: undefined,
          valor_nuevo: 'Creado desde sincronización',
          id_sincronizacion: syncId,
        });

        await qr.commitTransaction();
        return { numero_documento: registro.numero_documento, accion: 'INSERT', version_persona: 1 };
      }

      // ─── VALIDAR CONCURRENCIA (version_base vs version_persona) ────────────────
      const versionServidor = existente.version_persona || 1;

      // COMPORTAMIENTO DE TRANSICIÓN SEGURO Y EXPLICÍTO:
      // Si el registro no tiene version_base (proviene de una versión antigua de la aplicación),
      // no existe información suficiente para comprobar concurrencia. Para evitar falsos conflictos
      // y mantener la compatibilidad, aceptamos la actualización normalmente sin generar conflicto.
      if (registro.version_base !== undefined && registro.version_base !== null) {
        const versionBase = registro.version_base;
        if (versionBase !== versionServidor) {
          // CONCURRENCIA: No sobrescribir, registrar conflictos campo a campo
          const conflictosCreados: string[] = [];

          for (const campo of CAMPOS_PERMITIDOS) {
            const nuevoVal = registro[campo];
            const viejoVal = (existente as any)[campo];

            if (nuevoVal !== undefined && nuevoVal !== null && nuevoVal !== '') {
              if (String(viejoVal ?? '') !== String(nuevoVal)) {
                // Verificar si ya existe un conflicto PENDING para esta persona y campo
                const conflictoExistente = await qr.manager.findOne(ConflictoEntity, {
                  where: {
                    persona_documento: registro.numero_documento,
                    campo: campo as string,
                    estado: 'PENDING',
                  },
                });

                if (conflictoExistente) {
                  conflictoExistente.valor_recibido = String(nuevoVal);
                  conflictoExistente.version_base_recibida = versionBase;
                  conflictoExistente.fecha_creacion = new Date();
                  await qr.manager.save(conflictoExistente);
                } else {
                  const conflicto = qr.manager.create(ConflictoEntity, {
                    persona_documento: registro.numero_documento,
                    campo: campo as string,
                    valor_actual: viejoVal !== null && viejoVal !== undefined ? String(viejoVal) : null,
                    valor_recibido: String(nuevoVal),
                    usuario_id: usuarioId,
                    origen: 'OFFLINE',
                    estado: 'PENDING',
                    id_sincronizacion: syncId,
                    version_actual_servidor: versionServidor,
                    version_base_recibida: versionBase,
                  });
                  await qr.manager.save(conflicto);
                }
                conflictosCreados.push(campo as string);
              }
            }
          }

          if (conflictosCreados.length > 0) {
            existente.estado_sincronizacion = 'INCONSISTENCIA';
            await qr.manager.save(existente);
            await qr.commitTransaction();
            return {
              numero_documento: registro.numero_documento,
              accion: 'CONFLICTO' as any,
              campos_modificados: conflictosCreados,
            };
          }

          await qr.rollbackTransaction();
          return { numero_documento: registro.numero_documento, accion: 'SIN_CAMBIOS' };
        }
      }

      // ─── UPDATE NORMAL ───────────────────────────────────────────────────
      const cambios: string[] = [];
      const historialItems: Partial<HistorialCambiosEntity>[] = [];

      for (const campo of CAMPOS_PERMITIDOS) {
        const nuevoVal = registro[campo];
        const viejoVal = (existente as any)[campo];

        if (nuevoVal !== undefined && nuevoVal !== null && nuevoVal !== '') {
          if (String(viejoVal ?? '') !== String(nuevoVal)) {
            (existente as any)[campo] = nuevoVal;
            cambios.push(campo as string);
            historialItems.push({
              numero_documento: registro.numero_documento,
              id_usuario: usuarioId,
              campo_modificado: campo as string,
              valor_anterior: viejoVal !== null && viejoVal !== undefined ? String(viejoVal) : undefined,
              valor_nuevo: String(nuevoVal),
              id_sincronizacion: syncId,
            });
          }
        }
      }

      if (cambios.length === 0) {
        await qr.rollbackTransaction();
        return { numero_documento: registro.numero_documento, accion: 'SIN_CAMBIOS', version_persona: versionServidor };
      }

      existente.estado_sincronizacion = 'SYNCED';
      existente.version_persona = versionServidor + 1;
      existente.ultimo_editor_id = usuarioId;
      await qr.manager.save(existente);

      for (const item of historialItems) {
        await qr.manager.save(HistorialCambiosEntity, item);
      }

      await qr.commitTransaction();
      return {
        numero_documento: registro.numero_documento,
        accion: 'UPDATE',
        campos_modificados: cambios,
        version_persona: existente.version_persona,
      };
    } catch (error: any) {
      await qr.rollbackTransaction();
      return {
        numero_documento: registro.numero_documento,
        accion: 'ERROR',
        error: error?.message || 'Error desconocido',
      };
    } finally {
      await qr.release();
    }
  }

  // ─── MÉTODOS DE ADMINISTRACIÓN DE CONFLICTOS ──────────────────────────────

  async obtenerMetricasConflictos() {
    const totalPersonas = await this.personaRepo.count();
    const pendientes = await this.conflictoRepo.count({ where: { estado: 'PENDING' } });
    const resueltos = await this.conflictoRepo.count({ where: { estado: 'RESOLVED' } });
    const syncs = await this.historialSyncRepo.count();
    const encuestadores = await this.dataSource.getRepository(UsuarioEntity).count({ where: { estado: 'Activo' } });

    return {
      totalPersonas,
      pendientes,
      resueltos,
      syncs,
      encuestadores,
    };
  }

  async listarConflictos(estado: string = 'PENDING') {
    const dbEstado = estado === 'RESUELTO' ? 'RESOLVED' : 'PENDING';
    const conflictos = await this.conflictoRepo.find({
      where: { estado: dbEstado },
      order: { fecha_creacion: 'DESC' },
    });

    const result: any[] = [];
    for (const c of conflictos) {
      let encuestadorNombre = 'Encuestador';
      if (c.usuario_id) {
        const u = await this.dataSource.getRepository(UsuarioEntity).findOne({ where: { id: c.usuario_id } });
        if (u) encuestadorNombre = `${u.nombre} ${u.apellido}`;
      }

      result.push({
        id: c.id,
        persona_documento: c.persona_documento,
        campo: c.campo,
        valor_actual: c.valor_actual,
        valor_recibido: c.valor_recibido,
        valor_resuelto: c.valor_resuelto,
        usuario_id: c.usuario_id,
        encuestador_nombre: encuestadorNombre,
        fecha_creacion: c.fecha_creacion,
        origen: c.origen,
        estado: c.estado === 'RESOLVED' ? 'RESUELTO' : 'PENDING',
        resuelto_por: c.resuelto_por,
        fecha_resolucion: c.fecha_resolucion,
        decision: c.decision,
        motivo: c.motivo,
        version_actual_servidor: c.version_actual_servidor,
        version_base_recibida: c.version_base_recibida,
      });
    }

    return result;
  }

  async obtenerConflictoDetalle(id: number) {
    const conflicto = await this.conflictoRepo.findOne({ where: { id } });
    if (!conflicto) throw new NotFoundException(`No existe conflicto con ID ${id}`);

    const persona = await this.personaRepo.findOne({ where: { numero_documento: conflicto.persona_documento } });

    let encuestadorNombre = 'Encuestador';
    if (conflicto.usuario_id) {
      const u = await this.dataSource.getRepository(UsuarioEntity).findOne({ where: { id: conflicto.usuario_id } });
      if (u) encuestadorNombre = `${u.nombre} ${u.apellido}`;
    }

    return {
      conflicto: {
        id: conflicto.id,
        persona_documento: conflicto.persona_documento,
        campo: conflicto.campo,
        valor_actual: conflicto.valor_actual,
        valor_recibido: conflicto.valor_recibido,
        valor_resuelto: conflicto.valor_resuelto,
        usuario_id: conflicto.usuario_id,
        encuestador_nombre: encuestadorNombre,
        fecha_creacion: conflicto.fecha_creacion,
        origen: conflicto.origen,
        estado: conflicto.estado === 'RESOLVED' ? 'RESUELTO' : 'PENDING',
        version_actual_servidor: conflicto.version_actual_servidor,
        version_base_recibida: conflicto.version_base_recibida,
      },
      persona,
    };
  }

  async resolverConflicto(
    id: number,
    decision: 'MANTENER_ACTUAL' | 'ACEPTAR_NUEVO' | 'EDICION_MANUAL',
    valorEdicionManual: string,
    motivo: string,
    adminUsuarioId: number,
  ) {
    const conflicto = await this.conflictoRepo.findOne({ where: { id } });
    if (!conflicto) throw new NotFoundException(`No existe conflicto con ID ${id}`);
    if (conflicto.estado === 'RESOLVED') throw new BadRequestException('El conflicto ya fue resuelto previamente.');

    const persona = await this.personaRepo.findOne({ where: { numero_documento: conflicto.persona_documento } });
    if (!persona) throw new NotFoundException(`Persona ${conflicto.persona_documento} no encontrada.`);

    let valorResuelto = conflicto.valor_actual || '';

    if (decision === 'ACEPTAR_NUEVO') {
      valorResuelto = conflicto.valor_recibido || '';
      (persona as any)[conflicto.campo] = valorResuelto;
      persona.version_persona = (persona.version_persona || 1) + 1;
      persona.ultimo_editor_id = adminUsuarioId;
      persona.estado_sincronizacion = 'SYNCED';
      await this.personaRepo.save(persona);

      await this.historialCambiosRepo.save({
        numero_documento: persona.numero_documento,
        id_usuario: adminUsuarioId,
        campo_modificado: conflicto.campo,
        valor_anterior: conflicto.valor_actual || undefined,
        valor_nuevo: valorResuelto,
        id_sincronizacion: conflicto.id_sincronizacion,
      });
    } else if (decision === 'EDICION_MANUAL') {
      if (!valorEdicionManual || valorEdicionManual.trim() === '') {
        throw new BadRequestException('El valor de edición manual es obligatorio para esta decisión.');
      }
      valorResuelto = valorEdicionManual.trim();
      (persona as any)[conflicto.campo] = valorResuelto;
      persona.version_persona = (persona.version_persona || 1) + 1;
      persona.ultimo_editor_id = adminUsuarioId;
      persona.estado_sincronizacion = 'SYNCED';
      await this.personaRepo.save(persona);

      await this.historialCambiosRepo.save({
        numero_documento: persona.numero_documento,
        id_usuario: adminUsuarioId,
        campo_modificado: conflicto.campo,
        valor_anterior: conflicto.valor_actual || undefined,
        valor_nuevo: valorResuelto,
        id_sincronizacion: conflicto.id_sincronizacion,
      });
    } else {
      // MANTENER_ACTUAL
      valorResuelto = conflicto.valor_actual || '';
      persona.estado_sincronizacion = 'SYNCED';
      await this.personaRepo.save(persona);

      await this.historialCambiosRepo.save({
        numero_documento: persona.numero_documento,
        id_usuario: adminUsuarioId,
        campo_modificado: conflicto.campo,
        valor_anterior: conflicto.valor_recibido || undefined,
        valor_nuevo: valorResuelto,
        id_sincronizacion: conflicto.id_sincronizacion,
      });
    }

    conflicto.estado = 'RESOLVED';
    conflicto.decision = decision;
    conflicto.valor_resuelto = valorResuelto;
    conflicto.motivo = motivo;
    conflicto.resuelto_por = adminUsuarioId;
    conflicto.fecha_resolucion = new Date();
    await this.conflictoRepo.save(conflicto);

    return { exito: true, mensaje: 'Conflicto resuelto exitosamente.', valor_resuelto: valorResuelto };
  }
}
