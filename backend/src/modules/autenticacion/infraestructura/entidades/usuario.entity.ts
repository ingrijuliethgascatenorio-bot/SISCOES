import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario: string;

  @Column()
  contrasena: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  correo: string;

  @Column({ default: 'Activo' })
  estado: string;

  @Column({ type: 'varchar', length: 30, default: 'ENCUESTADOR', nullable: true })
  rol!: string;
}
