import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../aplicacion/auth.service';
import { LoginDto } from '../dominio/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validarUsuario(body.username, body.password);
    return this.authService.login(user);
  }
}
