import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SincronizacionController } from './presentacion/sincronizacion.controller';
import { SincronizacionService } from './aplicacion/sincronizacion.service';
import { PersonaEntity } from '../personas/infraestructura/entidades/persona.entity';
import { HistorialCambiosEntity } from './infraestructura/entidades/historial-cambios.entity';
import { HistorialSincronizacionEntity } from './infraestructura/entidades/historial-sincronizacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonaEntity,
      HistorialCambiosEntity,
      HistorialSincronizacionEntity,
    ]),
  ],
  controllers: [SincronizacionController],
  providers: [SincronizacionService],
})
export class SincronizacionModule {}
