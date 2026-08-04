import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { HistorialService } from '../../historial/aplicacion/historial.service';

@Injectable()
export class ReportesService {
  constructor(private readonly historialService: HistorialService) {}

  // ─── DATOS BASE ─────────────────────────────────────────────────────────
  private async _obtenerDatosReporte(id: number) {
    const { sincronizacion, cambios } = await this.historialService.consultarDetalleSincronizacion(id);
    const cambiosOrdenados = [...cambios].sort((a, b) => {
      const fa = new Date(a.fecha).getTime();
      const fb = new Date(b.fecha).getTime();
      if (fa !== fb) return fa - fb;
      const na = `${a.nombres ?? ''} ${a.apellidos ?? ''}`.trim().toLowerCase();
      const nb = `${b.nombres ?? ''} ${b.apellidos ?? ''}`.trim().toLowerCase();
      return na.localeCompare(nb);
    });
    return { sincronizacion, cambios: cambiosOrdenados };
  }

  private _formatFecha(d: any): string {
    if (!d) return 'N/A';
    const fecha = new Date(d);
    return fecha.toLocaleDateString('es-CO');
  }

  private _formatHora(d: any): string {
    if (!d) return 'N/A';
    const fecha = new Date(d);
    return fecha.toLocaleTimeString('es-CO');
  }

  private _duracion(ms: number): string {
    if (!ms) return '0s';
    const seg = Math.floor(ms / 1000);
    return seg > 60 ? `${Math.floor(seg / 60)}m ${seg % 60}s` : `${seg}s`;
  }

  // ─── GENERAR TXT ────────────────────────────────────────────────────────
  async generarTxt(id: number): Promise<string> {
    const { sincronizacion: s, cambios } = await this._obtenerDatosReporte(id);
    const sep = '------------------------------------------------------------';
    const lineas: string[] = [
      sep,
      'SISTEMA DE GESTIÓN DE ENCUESTAS DE SALUD',
      'SECRETARÍA DE SALUD',
      sep,
      '',
      `Generado el: ${new Date().toLocaleString('es-CO')}`,
      `Usuario:     ${s?.nombre_usuario ?? 'N/A'}`,
      '',
      sep,
      'RESUMEN DE SINCRONIZACIÓN',
      sep,
      `Fecha:               ${this._formatFecha(s?.fecha_inicio)}`,
      `Hora de inicio:      ${this._formatHora(s?.fecha_inicio)}`,
      `Hora de fin:         ${this._formatHora(s?.fecha_fin)}`,
      `Tiempo empleado:     ${this._duracion(s?.duracion_ms ?? 0)}`,
      `Total registros:     ${s?.cantidad_registros ?? 0}`,
      `Nuevos:              ${s?.registros_nuevos ?? 0}`,
      `Actualizados:        ${s?.registros_actualizados ?? 0}`,
      `Errores:             ${s?.registros_error ?? 0}`,
      `Estado:              ${s?.estado ?? 'N/A'}`,
      '',
      sep,
      'DETALLE DE CAMBIOS',
      sep,
      '',
    ];

    if (cambios.length === 0) {
      lineas.push('  Sin cambios registrados en esta sincronización.');
    } else {
      for (const c of cambios) {
        lineas.push(
          `  Persona:   ${c.nombres ?? ''} ${c.apellidos ?? ''}`.trimEnd(),
          `  Documento: ${c.numero_documento}`,
          `  Campo:     ${c.campo_modificado}`,
          `  Anterior:  ${c.valor_anterior ?? '(vacío)'}`,
          `  Nuevo:     ${c.valor_nuevo ?? '(vacío)'}`,
          `  Fecha:     ${this._formatFecha(c.fecha)}`,
          `  Hora:      ${this._formatHora(c.fecha)}`,
          `  Usuario:   ${c.nombre_usuario ?? s?.nombre_usuario ?? 'N/A'}`,
          '',
          sep,
          '',
        );
      }
    }

    lineas.push(`Fin del reporte — ${new Date().toLocaleString('es-CO')}`);
    return lineas.join('\n');
  }

  // ─── GENERAR PDF ────────────────────────────────────────────────────────
  async generarPdf(id: number): Promise<Buffer> {
    const { sincronizacion: s, cambios } = await this._obtenerDatosReporte(id);

    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const COLOR_PRIMARIO = '#1a3c5e';
      const COLOR_ACENTO  = '#2980b9';
      const COLOR_LINEA   = '#cccccc';
      let paginaNum = 1;

      const encabezado = () => {
        doc.rect(0, 0, doc.page.width, 70).fill(COLOR_PRIMARIO);
        doc.fillColor('white').fontSize(16).font('Helvetica-Bold')
          .text('SISTEMA DE GESTIÓN DE ENCUESTAS DE SALUD', 50, 18, { align: 'center' });
        doc.fontSize(10).font('Helvetica')
          .text('SECRETARÍA DE SALUD', 50, 40, { align: 'center' });
        doc.fillColor('#333333').moveDown(2);
      };

      const pieDepagina = () => {
        const y = doc.page.height - 40;
        doc.moveTo(50, y).lineTo(doc.page.width - 50, y).strokeColor(COLOR_LINEA).stroke();
        doc.fillColor('#888888').fontSize(8)
          .text(`Generado el ${new Date().toLocaleString('es-CO')}   |   Página ${paginaNum}`, 50, y + 8, { align: 'center' });
        paginaNum++;
      };

      // --- Portada / Encabezado ---
      encabezado();
      doc.y = 90;

      doc.fillColor(COLOR_PRIMARIO).fontSize(13).font('Helvetica-Bold')
        .text('RESUMEN DE SINCRONIZACIÓN', { underline: true });
      doc.moveDown(0.5);

      const filaResumen = (etiqueta: string, valor: string) => {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#333333').text(etiqueta + ':', { continued: true, width: 180 });
        doc.font('Helvetica').text(' ' + valor);
      };

      filaResumen('Fecha', this._formatFecha(s?.fecha_inicio));
      filaResumen('Hora de inicio', this._formatHora(s?.fecha_inicio));
      filaResumen('Hora de fin', this._formatHora(s?.fecha_fin));
      filaResumen('Tiempo empleado', this._duracion(s?.duracion_ms ?? 0));
      filaResumen('Usuario', s?.nombre_usuario ?? 'N/A');
      filaResumen('Total registros', String(s?.cantidad_registros ?? 0));
      filaResumen('Nuevos', String(s?.registros_nuevos ?? 0));
      filaResumen('Actualizados', String(s?.registros_actualizados ?? 0));
      filaResumen('Errores', String(s?.registros_error ?? 0));
      filaResumen('Estado', s?.estado ?? 'N/A');

      doc.moveDown(1.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor(COLOR_ACENTO).lineWidth(1.5).stroke();
      doc.moveDown(1);

      doc.fillColor(COLOR_PRIMARIO).fontSize(13).font('Helvetica-Bold')
        .text('DETALLE DE CAMBIOS', { underline: true });
      doc.moveDown(0.7);

      if (cambios.length === 0) {
        doc.font('Helvetica').fontSize(10).fillColor('#666666')
          .text('Sin cambios registrados en esta sincronización.');
      } else {
        let i = 0;
        for (const c of cambios) {
          // Nueva página si queda poco espacio
          if (doc.y > doc.page.height - 160) {
            pieDepagina();
            doc.addPage();
            encabezado();
            doc.y = 90;
          }

          const bgColor = i % 2 === 0 ? '#f0f4f8' : '#ffffff';
          const startY = doc.y;
          doc.rect(50, startY - 4, doc.page.width - 100, 100).fill(bgColor);
          doc.fillColor('#333333');

          doc.font('Helvetica-Bold').fontSize(10)
            .text(`${c.nombres ?? ''} ${c.apellidos ?? ''}`.trim() || 'Sin nombre', 60, startY);
          doc.font('Helvetica').fontSize(9)
            .text(`Documento: ${c.numero_documento}   |   Campo: ${c.campo_modificado}`, 60);
          doc.fillColor('#c0392b').text(`Anterior: ${c.valor_anterior ?? '(vacío)'}`, 60);
          doc.fillColor('#27ae60').text(`Nuevo: ${c.valor_nuevo ?? '(vacío)'}`, 60);
          doc.fillColor('#555555').fontSize(8)
            .text(`Fecha: ${this._formatFecha(c.fecha)}  Hora: ${this._formatHora(c.fecha)}  Usuario: ${c.nombre_usuario ?? s?.nombre_usuario ?? 'N/A'}`, 60);

          doc.y = startY + 106;
          i++;
        }
      }

      pieDepagina();
      doc.end();
    });
  }
}
