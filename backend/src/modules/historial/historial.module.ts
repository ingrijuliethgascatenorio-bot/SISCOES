import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCambiosEntity } from '../sincronizacion/infraestructura/entidades/historial-cambios.entity';
import { HistorialSincronizacionEntity } from '../sincronizacion/infraestructura/entidades/historial-sincronizacion.entity';
import { HistorialService } from './aplicacion/historial.service';
import { HistorialController } from './presentacion/historial.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialCambiosEntity, HistorialSincronizacionEntity]),
  ],
  controllers: [HistorialController],
  providers: [HistorialService],
  exports: [HistorialService],
})
export class HistorialModule {}
