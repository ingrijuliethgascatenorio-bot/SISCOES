import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SincronizacionController } from './presentacion/sincronizacion.controller';
import { AdminConflictosController } from './presentacion/admin-conflictos.controller';
import { SincronizacionService } from './aplicacion/sincronizacion.service';
import { PersonaEntity } from '../personas/infraestructura/entidades/persona.entity';
import { HistorialCambiosEntity } from './infraestructura/entidades/historial-cambios.entity';
import { HistorialSincronizacionEntity } from './infraestructura/entidades/historial-sincronizacion.entity';
import { ConflictoEntity } from './infraestructura/entidades/conflicto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonaEntity,
      HistorialCambiosEntity,
      HistorialSincronizacionEntity,
      ConflictoEntity,
    ]),
  ],
  controllers: [SincronizacionController, AdminConflictosController],
  providers: [SincronizacionService],
})
export class SincronizacionModule {}
