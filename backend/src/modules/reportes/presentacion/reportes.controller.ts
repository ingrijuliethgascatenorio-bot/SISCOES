import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../autenticacion/infraestructura/guards/jwt-auth.guard';
import { ReportesService } from '../aplicacion/reportes.service';

@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('sincronizacion/:id/txt')
  async descargarTxt(@Param('id') id: string, @Res() res: Response) {
    const contenido = await this.reportesService.generarTxt(parseInt(id, 10));
    const nombreArchivo = `reporte_sync_${id}_${Date.now()}.txt`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(contenido);
  }

  @Get('sincronizacion/:id/pdf')
  async descargarPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.reportesService.generarPdf(parseInt(id, 10));
    const nombreArchivo = `reporte_sync_${id}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }
}
