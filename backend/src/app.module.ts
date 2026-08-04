import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { PersonasModule } from './modules/personas/personas.module';
import { SincronizacionModule } from './modules/sincronizacion/sincronizacion.module';
import { HistorialModule } from './modules/historial/historial.module';
import { ReportesModule } from './modules/reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AutenticacionModule,
    PersonasModule,
    SincronizacionModule,
    HistorialModule,
    ReportesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

