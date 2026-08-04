import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './aplicacion/auth.service';
import { AuthController } from './presentacion/auth.controller';
import { JwtStrategy } from './infraestructura/estrategias/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './infraestructura/entidades/usuario.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super_secret_key_change_me_in_prod'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
    TypeOrmModule.forFeature([UsuarioEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AutenticacionModule {}
