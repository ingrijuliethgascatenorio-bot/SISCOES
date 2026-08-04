import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('personas')
export class PersonaEntity {
  @PrimaryColumn({ name: 'numero_documento', type: 'varchar', length: 50 })
  numero_documento!: string;

  @Column({ name: 'id_tipo_documento', nullable: true })
  id_tipo_documento!: number;

  @Column({ length: 200 })
  nombres!: string;

  @Column({ length: 200 })
  apellidos!: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fecha_nacimiento!: Date;

  @Column({ length: 20, nullable: true })
  genero!: string;

  @Column({ name: 'id_eps', nullable: true })
  id_eps!: number;

  @Column({ name: 'eps_otro_nombre', length: 200, nullable: true })
  eps_otro_nombre!: string;

  @Column({ length: 300, nullable: true })
  direccion!: string;

  @Column({ length: 100, nullable: true })
  barrio!: string;

  @Column({ length: 5, nullable: true })
  estrato!: string;

  @Column({ length: 200, nullable: true })
  correo!: string;

  @Column({ name: 'estado_civil', length: 30, nullable: true })
  estado_civil!: string;

  @Column({ length: 20, nullable: true })
  telefono1!: string;

  @Column({ length: 20, nullable: true })
  telefono2!: string;

  @Column({ length: 20, nullable: true })
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
}
