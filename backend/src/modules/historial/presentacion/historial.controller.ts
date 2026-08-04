import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../autenticacion/infraestructura/guards/jwt-auth.guard';
import { HistorialService } from '../aplicacion/historial.service';
import type { FiltroHistorialDto, PaginacionDto } from '../dominio/dto/historial.dto';

@UseGuards(JwtAuthGuard)
@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get('persona/:numero_documento')
  consultarPorPersona(
    @Param('numero_documento') numeroDocumento: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('fecha') fecha?: string,
  ) {
    const filtro: FiltroHistorialDto = {
      numero_documento: numeroDocumento,
      pagina: pagina ? parseInt(pagina, 10) : 1,
      limite: limite ? parseInt(limite, 10) : 20,
      fecha,
    };
    return this.historialService.consultarPorPersona(filtro);
  }

  @Get('sincronizaciones')
  consultarSincronizaciones(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const dto: PaginacionDto = {
      pagina: pagina ? parseInt(pagina, 10) : 1,
      limite: limite ? parseInt(limite, 10) : 10,
    };
    return this.historialService.consultarSincronizaciones(dto);
  }

  @Get('sincronizaciones/:id')
  consultarDetalle(@Param('id') id: string) {
    return this.historialService.consultarDetalleSincronizacion(parseInt(id, 10));
  }
}
