import { Module } from '@nestjs/common';
import { ReportesService } from './aplicacion/reportes.service';
import { ReportesController } from './presentacion/reportes.controller';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [HistorialModule],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
