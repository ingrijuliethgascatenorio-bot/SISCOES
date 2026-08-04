/**
 * SERVICIO SINCRONIZACIÓN (JS ES6)
 * Realiza la sincronización entre la base local SQLite y el Backend NestJS / PostgreSQL.
 *
 * IMPORTANTE: la ruta y el nombre de los campos deben coincidir EXACTO con lo que
 * espera el backend (`sincronizacion.controller.ts` → POST /sincronizacion,
 * body `{ registros: [...] }`, cada registro con los mismos nombres de columna
 * que usa `PersonaSyncDto` en el backend).
 */

import { sqliteService } from './sqlite.service.js';
import { apiService } from './api.service.js';

class SyncService {
  async obtenerPendientes() {
    return await sqliteService.query(
      "SELECT * FROM Persona WHERE estado_sincronizacion IN ('PENDING_INSERT', 'PENDING_UPDATE', 'ERROR')"
    );
  }

  /**
   * Convierte un registro de SQLite (esquema local) al formato exacto
   * que espera el backend (PersonaSyncDto).
   */
  mapearParaBackend(p) {
    return {
      numero_documento: p.numero_documento,
      id_tipo_documento: Number(p.id_tipo_documento),
      nombres: p.nombres,
      apellidos: p.apellidos,
      fecha_nacimiento: p.fecha_nacimiento,
      genero: p.genero,
      id_eps: Number(p.id_eps),
      eps_otro_nombre: p.eps_otro_nombre || undefined,
      direccion: p.direccion || undefined,
      barrio: p.barrio || undefined,
      estrato: p.estrato || undefined,
      correo: p.correo || undefined,
      estado_civil: p.estado_civil || undefined,
      telefono1: p.telefono1 || undefined,
      telefono2: p.telefono2 || undefined,
      telefono3: p.telefono3 || undefined,
      estado: p.estado_registro === 'INACTIVO' ? 'Inactivo' : 'Activo',
      estado_sincronizacion: p.estado_sincronizacion,
      fecha_actualizacion: p.fecha_actualizacion
    };
  }

  async sincronizar() {
    const fechaInicio = new Date().toISOString();
    const pendientes = await this.obtenerPendientes();

    if (pendientes.length === 0) {
      return { exito: true, mensaje: 'No hay registros pendientes por sincronizar.', procesados: 0 };
    }

    try {
      const payload = {
        registros: pendientes.map(p => this.mapearParaBackend(p))
      };

      // Ruta real del backend: POST /sincronizacion (no "/sincronizaciones/lote")
      const respuesta = await apiService.post('/sincronizacion', payload);

      const ahora = new Date().toISOString();
      const detalles = respuesta?.detalles || [];

      // El backend responde con un detalle por registro (accion: INSERT/UPDATE/ERROR/SIN_CAMBIOS).
      // Actualizamos cada registro local según lo que el backend realmente confirmó,
      // en vez de asumir que todo salió bien.
      for (const p of pendientes) {
        const detalle = detalles.find(d => d.numero_documento === p.numero_documento);
        const nuevoEstado = (detalle && detalle.accion === 'ERROR') ? 'ERROR' : 'SYNCED';

        await sqliteService.run(
          'UPDATE Persona SET estado_sincronizacion = ?, fecha_actualizacion = ? WHERE id = ?',
          [nuevoEstado, ahora, p.id]
        );
      }

      const fechaFin = new Date().toISOString();
      const errores = respuesta?.errores || 0;
      const estadoLog = errores > 0 ? 'ERROR' : 'ÉXITO';
      const mensaje = errores > 0
        ? `Sincronización completada con ${errores} error(es) de ${pendientes.length} registros.`
        : `Se sincronizaron ${pendientes.length} registros exitosamente con PostgreSQL.`;

      await sqliteService.run(
        `INSERT INTO SincronizacionLog (fecha_inicio, fecha_fin, estado, cantidad_registros, mensaje)
         VALUES (?, ?, ?, ?, ?)`,
        [fechaInicio, fechaFin, estadoLog, pendientes.length, mensaje]
      );
      await sqliteService.guardarPersistencia();

      return { exito: errores === 0, mensaje, procesados: pendientes.length };

    } catch (error) {
      console.error('Error durante la sincronización:', error);

      const fechaFin = new Date().toISOString();
      await sqliteService.run(
        `INSERT INTO SincronizacionLog (fecha_inicio, fecha_fin, estado, cantidad_registros, mensaje)
         VALUES (?, ?, 'ERROR', ?, ?)`,
        [fechaInicio, fechaFin, 0, error.message || 'Error de conexión']
      );
      await sqliteService.guardarPersistencia();

      throw error;
    }
  }

  async obtenerUltimaSync() {
    const res = await sqliteService.query('SELECT * FROM SincronizacionLog ORDER BY id DESC LIMIT 1');
    return res.length > 0 ? res[0] : null;
  }
}

export const syncService = new SyncService();
