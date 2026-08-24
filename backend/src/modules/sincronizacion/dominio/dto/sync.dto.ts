import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEmail,
  IsIn,
  IsDateString,
  Matches,
  Length,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PersonaSyncDto {
  @IsString()
  @IsNotEmpty({ message: 'El número de documento es obligatorio.' })
  @Matches(/^[0-9]+$/, { message: 'El número de documento solo puede contener dígitos.' })
  @Length(6, 15, { message: 'El número de documento debe tener entre 6 y 15 dígitos.' })
  numero_documento!: string;

  @IsOptional()
  @IsInt()
  id_tipo_documento?: number;

  @IsString()
  @IsNotEmpty({ message: 'Los nombres son obligatorios.' })
  nombres!: string;

  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios.' })
  apellidos!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Fecha de nacimiento inválida.' })
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @IsInt()
  id_eps?: number;

  @IsOptional()
  @IsString()
  eps_otro_nombre?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  barrio?: string;

  @IsOptional()
  @Matches(/^[1-6]$/, { message: 'El estrato debe ser un número entre 1 y 6.' })
  estrato?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Correo electrónico no válido.' })
  correo?: string;

  @IsOptional()
  @IsString()
  estado_civil?: string;

  @IsOptional()
  @Matches(/^[0-9]{7,10}$/, { message: 'El teléfono debe tener entre 7 y 10 dígitos.' })
  telefono1?: string;

  @IsOptional()
  @Matches(/^[0-9]{7,10}$/, { message: 'El teléfono debe tener entre 7 y 10 dígitos.' })
  telefono2?: string;

  @IsOptional()
  @Matches(/^[0-9]{7,10}$/, { message: 'El teléfono debe tener entre 7 y 10 dígitos.' })
  telefono3?: string;

  @IsOptional()
  @IsIn(['Activo', 'Inactivo'])
  estado?: string;

  @IsOptional()
  @IsString()
  estado_sincronizacion?: string;

  @IsOptional()
  @IsDateString()
  fecha_actualizacion?: string;

  @IsOptional()
  @IsInt()
  version_base?: number;
}

export class SyncRequestDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe enviar al menos un registro para sincronizar.' })
  @ValidateNested({ each: true })
  @Type(() => PersonaSyncDto)
  registros!: PersonaSyncDto[];
}

export interface SyncResultadoItem {
  numero_documento: string;
  accion: 'INSERT' | 'UPDATE' | 'ERROR' | 'SIN_CAMBIOS';
  campos_modificados?: string[];
  error?: string;
  version_persona?: number;
}

export interface SyncResponseDto {
  total_procesados: number;
  nuevos: number;
  actualizados: number;
  sin_cambios: number;
  errores: number;
  tiempo_ms: number;
  detalles: SyncResultadoItem[];
}
