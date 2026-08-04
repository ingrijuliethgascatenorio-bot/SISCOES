export interface PaginacionDto {
  pagina?: number;
  limite?: number;
}

export interface FiltroHistorialDto extends PaginacionDto {
  numero_documento?: string;
  nombre?: string;
  apellido?: string;
  fecha?: string;
  usuario?: string;
}

export interface HistorialCambioResponseDto {
  id: number;
  numero_documento: string;
  nombres?: string;
  apellidos?: string;
  nombre_usuario?: string;
  campo_modificado: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  fecha: Date;
}

export interface HistorialSyncResponseDto {
  id: number;
  nombre_usuario?: string;
  fecha_inicio: Date;
  fecha_fin?: Date;
  duracion_ms?: number;
  cantidad_registros: number;
  registros_nuevos: number;
  registros_actualizados: number;
  registros_sin_cambios: number;
  registros_error: number;
  estado: string;
  observaciones?: string;
}

export interface ResultadoPaginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
}
