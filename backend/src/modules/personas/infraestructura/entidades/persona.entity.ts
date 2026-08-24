import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('personas')
export class PersonaEntity {
  @PrimaryColumn({ name: 'numero_documento', type: 'varchar', length: 50 })
  numero_documento!: string;

  @Column({ name: 'id_tipo_documento', type: 'integer', nullable: true })
  id_tipo_documento!: number;

  @Column({ length: 200 })
  nombres!: string;

  @Column({ length: 200 })
  apellidos!: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fecha_nacimiento!: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  genero!: string;

  @Column({ name: 'id_eps', type: 'integer', nullable: true })
  id_eps!: number;

  @Column({ name: 'eps_otro_nombre', type: 'varchar', length: 200, nullable: true })
  eps_otro_nombre!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  direccion!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barrio!: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  estrato!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  correo!: string;

  @Column({ name: 'estado_civil', type: 'varchar', length: 30, nullable: true })
  estado_civil!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono1!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono2!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono3!: string;

  @Column({ length: 30, default: 'Activo' })
  estado!: string;

  @Column({
    name: 'estado_sincronizacion',
    length: 30,
    default: 'PENDING_INSERT'
  })
  estado_sincronizacion!: string;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fecha_actualizacion!: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion!: Date;

  @Column({ name: 'ultimo_editor_id', type: 'integer', nullable: true })
  ultimo_editor_id?: number | null;

  @Column({ name: 'version_persona', type: 'integer', default: 1 })
  version_persona!: number;
}
