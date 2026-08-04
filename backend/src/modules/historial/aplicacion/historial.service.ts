import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialCambiosEntity } from '../../sincronizacion/infraestructura/entidades/historial-cambios.entity';
import { HistorialSincronizacionEntity } from '../../sincronizacion/infraestructura/entidades/historial-sincronizacion.entity';
import type {
  FiltroHistorialDto,
  PaginacionDto,
  ResultadoPaginado,
  HistorialCambioResponseDto,
  HistorialSyncResponseDto,
} from '../dominio/dto/historial.dto';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(HistorialCambiosEntity)
    private cambiosRepo: Repository<HistorialCambiosEntity>,
    @InjectRepository(HistorialSincronizacionEntity)
    private syncRepo: Repository<HistorialSincronizacionEntity>,
  ) {}

  // ─── HISTORIAL DE CAMBIOS POR PERSONA ────────────────────────────────────
  async consultarPorPersona(
    filtro: FiltroHistorialDto,
  ): Promise<ResultadoPaginado<HistorialCambioResponseDto>> {
    const pagina = Math.max(1, filtro.pagina ?? 1);
    const limite = Math.min(100, filtro.limite ?? 20);
    const offset = (pagina - 1) * limite;

    const qb = this.cambiosRepo
      .createQueryBuilder('hc')
      .select([
        'hc.id',
        'hc.numero_documento',
        'hc.campo_modificado',
        'hc.valor_anterior',
        'hc.valor_nuevo',
        'hc.fecha',
        'hc.id_usuario',
      ])
      .orderBy('hc.fecha', 'DESC')
      .skip(offset)
      .take(limite);

    if (filtro.numero_documento) {
      qb.andWhere('hc.numero_documento ILIKE :doc', {
        doc: `%${filtro.numero_documento}%`,
      });
    }
    if (filtro.fecha) {
      qb.andWhere('CAST(hc.fecha AS DATE) = :fecha', { fecha: filtro.fecha });
    }

    const [registros, total] = await qb.getManyAndCount();

    const datos: HistorialCambioResponseDto[] = registros.map((r) => ({
      id: r.id,
      numero_documento: r.numero_documento,
      campo_modificado: r.campo_modificado,
      valor_anterior: r.valor_anterior,
      valor_nuevo: r.valor_nuevo,
      fecha: r.fecha,
    }));

    return {
      datos,
      total,
      pagina,
      limite,
      total_paginas: Math.ceil(total / limite),
    };
  }

  // ─── HISTORIAL DE SINCRONIZACIONES (LISTA PAGINADA) ──────────────────────
  async consultarSincronizaciones(
    dto: PaginacionDto,
  ): Promise<ResultadoPaginado<HistorialSyncResponseDto>> {
    const pagina = Math.max(1, dto.pagina ?? 1);
    const limite = Math.min(50, dto.limite ?? 10);
    const offset = (pagina - 1) * limite;

    const [registros, total] = await this.syncRepo.findAndCount({
      order: { fecha_inicio: 'DESC' },
      skip: offset,
      take: limite,
    });

    const datos: HistorialSyncResponseDto[] = registros.map((r) => ({
      id: r.id,
      nombre_usuario: r.nombre_usuario,
      fecha_inicio: r.fecha_inicio,
      fecha_fin: r.fecha_fin,
      duracion_ms: r.duracion_ms,
      cantidad_registros: r.cantidad_registros,
      registros_nuevos: r.registros_nuevos,
      registros_actualizados: r.registros_actualizados,
      registros_sin_cambios: r.registros_sin_cambios,
      registros_error: r.registros_error,
      estado: r.estado,
      observaciones: r.observaciones,
    }));

    return {
      datos,
      total,
      pagina,
      limite,
      total_paginas: Math.ceil(total / limite),
    };
  }

  // ─── DETALLE DE UNA SINCRONIZACIÓN ───────────────────────────────────────
  async consultarDetalleSincronizacion(
    id: number,
  ): Promise<{ sincronizacion: HistorialSyncResponseDto; cambios: HistorialCambioResponseDto[] }> {
    const sync = await this.syncRepo.findOne({ where: { id } });
    if (!sync) {
      return {
        sincronizacion: {} as HistorialSyncResponseDto,
        cambios: [],
      };
    }

    const cambios = await this.cambiosRepo.find({
      where: { id_sincronizacion: id },
      order: { fecha: 'DESC' },
    });

    return {
      sincronizacion: {
        id: sync.id,
        nombre_usuario: sync.nombre_usuario,
        fecha_inicio: sync.fecha_inicio,
        fecha_fin: sync.fecha_fin,
        duracion_ms: sync.duracion_ms,
        cantidad_registros: sync.cantidad_registros,
        registros_nuevos: sync.registros_nuevos,
        registros_actualizados: sync.registros_actualizados,
        registros_sin_cambios: sync.registros_sin_cambios,
        registros_error: sync.registros_error,
        estado: sync.estado,
        observaciones: sync.observaciones,
      },
      cambios: cambios.map((c) => ({
        id: c.id,
        numero_documento: c.numero_documento,
        campo_modificado: c.campo_modificado,
        valor_anterior: c.valor_anterior,
        valor_nuevo: c.valor_nuevo,
        fecha: c.fecha,
      })),
    };
  }
}
