import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../autenticacion/infraestructura/guards/jwt-auth.guard';
import { RolesGuard } from '../../autenticacion/infraestructura/guards/roles.guard';
import { Roles } from '../../autenticacion/infraestructura/decoradores/roles.decorator';
import { SincronizacionService } from '../aplicacion/sincronizacion.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/conflictos')
export class AdminConflictosController {
  constructor(private readonly syncService: SincronizacionService) {}

  @Get('metricas')
  async obtenerMetricas() {
    return this.syncService.obtenerMetricasConflictos();
  }

  @Get()
  async listarConflictos(@Query('estado') estado?: string) {
    return this.syncService.listarConflictos(estado);
  }

  @Get(':id')
  async obtenerDetalle(@Param('id') id: string) {
    return this.syncService.obtenerConflictoDetalle(parseInt(id, 10));
  }

  @Post(':id/resolver')
  async resolver(
    @Param('id') id: string,
    @Body() body: { decision: any; valorEdicionManual: string; motivo: string },
    @Request() req: any,
  ) {
    const adminUsuarioId = req.user?.userId ?? 0;
    return this.syncService.resolverConflicto(
      parseInt(id, 10),
      body.decision,
      body.valorEdicionManual,
      body.motivo,
      adminUsuarioId,
    );
  }
}
