import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PersonaEntity } from '../../personas/infraestructura/entidades/persona.entity';
import { HistorialCambiosEntity } from '../infraestructura/entidades/historial-cambios.entity';
import { HistorialSincronizacionEntity } from '../infraestructura/entidades/historial-sincronizacion.entity';
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
    private dataSource: DataSource,
  ) {}

  async sincronizar(dto: SyncRequestDto, usuarioId: number): Promise<SyncResponseDto> {
    const inicio = Date.now();
    let nuevos = 0;
    let actualizados = 0;
    let sinCambios = 0;
    let errores = 0;
    const detalles: SyncResultadoItem[] = [];

    for (const registro of dto.registros) {
      const resultado = await this._procesarRegistro(registro, usuarioId);
      detalles.push(resultado);
      if (resultado.accion === 'INSERT') nuevos++;
      else if (resultado.accion === 'UPDATE') actualizados++;
      else if (resultado.accion === 'SIN_CAMBIOS') sinCambios++;
      else errores++;
    }

    const tiempo_ms = Date.now() - inicio;
    const total_procesados = dto.registros.length;

    // Guardar resumen en HistorialSincronizacion
    await this.historialSyncRepo.save({
      id_usuario: usuarioId,
      fecha_fin: new Date(),
      duracion_ms: tiempo_ms,
      cantidad_registros: total_procesados,
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
  ): Promise<SyncResultadoItem> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const existente = await qr.manager.findOne(PersonaEntity, {
        where: { numero_documento: registro.numero_documento },
      });

      if (!existente) {
        // ─── INSERT ─────────────────────────────────────────────────────────
        const nueva = qr.manager.create(PersonaEntity, {
          ...registro,
          estado: registro.estado || 'Activo',
          estado_sincronizacion: 'SYNCED',
        } as any);
        await qr.manager.save(nueva);

        await qr.manager.save(HistorialCambiosEntity, {
          numero_documento: registro.numero_documento,
          id_usuario: usuarioId,
          campo_modificado: 'REGISTRO_NUEVO',
          valor_anterior: undefined,
          valor_nuevo: 'Creado desde sincronización',
        });

        await qr.commitTransaction();
        return { numero_documento: registro.numero_documento, accion: 'INSERT' };
      }

      // ─── UPDATE campo a campo ──────────────────────────────────────────────
      const cambios: string[] = [];
      const historialItems: Partial<HistorialCambiosEntity>[] = [];

      for (const campo of CAMPOS_PERMITIDOS) {
        const nuevoVal = registro[campo];
        const viejoVal = (existente as any)[campo];

        // Completar vacíos o actualizar si cambió
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
            });
          }
        }
      }

      if (cambios.length === 0) {
        await qr.rollbackTransaction();
        return { numero_documento: registro.numero_documento, accion: 'SIN_CAMBIOS' };
      }

      existente.estado_sincronizacion = 'SYNCED';
      await qr.manager.save(existente);

      for (const item of historialItems) {
        await qr.manager.save(HistorialCambiosEntity, item);
      }

      await qr.commitTransaction();
      return {
        numero_documento: registro.numero_documento,
        accion: 'UPDATE',
        campos_modificados: cambios,
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
}
