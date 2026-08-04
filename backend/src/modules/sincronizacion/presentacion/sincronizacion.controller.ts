import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../autenticacion/infraestructura/guards/jwt-auth.guard';
import { SincronizacionService } from '../aplicacion/sincronizacion.service';
import { SyncRequestDto, SyncResponseDto } from '../dominio/dto/sync.dto';

// OJO — IMPORTANTE: SyncRequestDto se debe importar como import normal,
// NUNCA como "import type". SyncRequestDto es una clase con decoradores
// de class-validator (@IsArray, @ValidateNested, etc.) que el
// ValidationPipe necesita encontrar como valor real en tiempo de
// ejecución para poder validar el cuerpo de la petición. Si se importa
// como "import type", TypeScript la borra del código compilado, y el
// validador termina rechazando TODAS las propiedades del body con el
// error "property X should not exist" — aunque el DTO esté bien escrito.
@UseGuards(JwtAuthGuard)
@Controller('sincronizacion')
export class SincronizacionController {
  constructor(private readonly syncService: SincronizacionService) {}

  @Post()
  async sincronizar(
    @Body() dto: SyncRequestDto,
    @Request() req: any,
  ): Promise<SyncResponseDto> {
    const usuarioId: number = req.user?.userId ?? 0;
    return this.syncService.sincronizar(dto, usuarioId);
  }
}