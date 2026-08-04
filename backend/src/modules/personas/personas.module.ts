import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaEntity } from './infraestructura/entidades/persona.entity';
import { PersonasService } from './aplicacion/personas.service';
import { PersonasController } from './presentacion/personas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonaEntity]),
  ],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [PersonasService],
})
export class PersonasModule {}
