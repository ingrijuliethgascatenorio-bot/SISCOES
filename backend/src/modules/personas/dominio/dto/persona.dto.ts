import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEmail, MaxLength } from 'class-validator';

export class CrearPersonaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numero_documento!: string;

  @IsNumber()
  @IsOptional()
  id_tipo_documento?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  apellidos!: string;

  @IsString()
  @IsOptional()
  fecha_nacimiento?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  genero?: string;

  @IsNumber()
  @IsOptional()
  id_eps?: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  eps_otro_nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  barrio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  estrato?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  estado_civil?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono3?: string;
}

export class ActualizarPersonaDto {
  @IsNumber()
  @IsOptional()
  id_eps?: number;

  @IsString()
  @IsOptional()
  eps_otro_nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  barrio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  estrato?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  estado_civil?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono3?: string;
}
