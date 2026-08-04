import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('historial_sincronizacion')
export class HistorialSincronizacionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'id_usuario', nullable: true })
  id_usuario!: number;

  @Column({ name: 'nombre_usuario', length: 200, nullable: true })
  nombre_usuario!: string;

  @CreateDateColumn({ name: 'fecha_inicio' })
  fecha_inicio!: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp', nullable: true })
  fecha_fin!: Date;

  @Column({ name: 'duracion_ms', nullable: true })
  duracion_ms!: number;

  @Column({ name: 'cantidad_registros', default: 0 })
  cantidad_registros!: number;

  @Column({ name: 'registros_nuevos', default: 0 })
  registros_nuevos!: number;

  @Column({ name: 'registros_actualizados', default: 0 })
  registros_actualizados!: number;

  @Column({ name: 'registros_sin_cambios', default: 0 })
  registros_sin_cambios!: number;

  @Column({ name: 'registros_error', default: 0 })
  registros_error!: number;

  @Column({ length: 30, default: 'COMPLETADO' })
  estado!: string;

  @Column({ name: 'tipo_archivo_generado', length: 30, nullable: true })
  tipo_archivo_generado!: string;

  @Column({ type: 'text', nullable: true })
  observaciones!: string;
}
