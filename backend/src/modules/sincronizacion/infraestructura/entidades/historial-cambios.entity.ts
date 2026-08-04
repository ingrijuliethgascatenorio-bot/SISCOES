import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('historial_cambios')
export class HistorialCambiosEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'numero_documento', length: 50 })
  numero_documento!: string;

  @Column({ name: 'id_usuario', nullable: true })
  id_usuario!: number;

  @Column({ name: 'campo_modificado', length: 100 })
  campo_modificado!: string;

  @Column({ name: 'valor_anterior', type: 'text', nullable: true })
  valor_anterior!: string;

  @Column({ name: 'valor_nuevo', type: 'text', nullable: true })
  valor_nuevo!: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha!: Date;

  @Column({ name: 'id_sincronizacion', nullable: true })
  id_sincronizacion!: number;
}
