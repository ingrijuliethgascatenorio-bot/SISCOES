import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../autenticacion/infraestructura/guards/jwt-auth.guard';
import { PersonasService } from '../aplicacion/personas.service';
import { CrearPersonaDto, ActualizarPersonaDto } from '../dominio/dto/persona.dto';

@UseGuards(JwtAuthGuard)
@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  /**
   * GET /personas
   * Lista paginada de personas con búsqueda opcional.
   * Query params: termino, estado, pagina, limite
   */
  @Get()
  findAll(
    @Query('termino') termino?: string,
    @Query('estado') estado?: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    return this.personasService.findAll(
      termino,
      estado,
      pagina ? parseInt(pagina, 10) : 1,
      limite ? parseInt(limite, 10) : 20,
    );
  }

  /**
   * GET /personas/:numero_documento
   * Obtiene una persona específica por número de documento.
   */
  @Get(':numero_documento')
  findOne(@Param('numero_documento') numeroDocumento: string) {
    return this.personasService.findOne(numeroDocumento);
  }

  /**
   * POST /personas
   * Registra una nueva persona (campos protegidos: documento, nombres, apellidos, f. nacimiento, género).
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CrearPersonaDto) {
    return this.personasService.create(dto);
  }

  /**
   * PUT /personas/:numero_documento
   * Actualiza solo campos permitidos (dirección, barrio, estrato, correo, EPS, teléfonos, estado civil).
   */
  @Put(':numero_documento')
  update(
    @Param('numero_documento') numeroDocumento: string,
    @Body() dto: ActualizarPersonaDto,
  ) {
    return this.personasService.update(numeroDocumento, dto);
  }

  /**
   * DELETE /personas/:numero_documento
   * Inactivación lógica — no elimina físicamente el registro.
   */
  @Delete(':numero_documento')
  @HttpCode(HttpStatus.OK)
  inactivar(@Param('numero_documento') numeroDocumento: string) {
    return this.personasService.inactivar(numeroDocumento);
  }
}
