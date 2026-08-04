import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioEntity } from '../infraestructura/entidades/usuario.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UsuarioEntity)
    private usuarioRepo: Repository<UsuarioEntity>
  ) {}

  async onModuleInit() {
    const username = 'encuestador1';
    const existente = await this.usuarioRepo.findOne({ where: { usuario: username } });
    if (!existente) {
      const contrasena = await bcrypt.hash('123456', 10);
      const usuario = this.usuarioRepo.create({
        usuario: username,
        contrasena,
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan.perez@salud.gov.co',
        estado: 'Activo'
      });
      await this.usuarioRepo.save(usuario);
      console.log('Seed inicial de usuario insertado:', username);
    }
  }

  async validarUsuario(username: string, pass: string): Promise<any> {
    const user = await this.usuarioRepo.findOne({ where: { usuario: username } });
    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }
    
    if (user.estado !== 'Activo') {
      throw new UnauthorizedException('El usuario no está activo.');
    }

    const isMatch = await bcrypt.compare(pass, user.contrasena);
    if (isMatch) {
      const { contrasena, ...result } = user;
      return result;
    }
    
    throw new UnauthorizedException('Usuario o contraseña incorrectos.');
  }

  async login(user: any) {
    const payload = { username: user.usuario, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 28800,
    };
  }
}
