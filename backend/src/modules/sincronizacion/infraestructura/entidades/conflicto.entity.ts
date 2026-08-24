import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('conflicto')
export class ConflictoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'persona_documento', length: 50 })
  persona_documento!: string;

  @Column({ length: 100 })
  campo!: string;

  @Column({ name: 'valor_actual', type: 'text', nullable: true })
  valor_actual?: string | null;

  @Column({ name: 'valor_recibido', type: 'text', nullable: true })
  valor_recibido?: string | null;

  @Column({ name: 'valor_resuelto', type: 'text', nullable: true })
  valor_resuelto?: string | null;

  @Column({ name: 'usuario_id', type: 'integer', nullable: true })
  usuario_id?: number | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion!: Date;

  @Column({ length: 20 })
  origen!: string;

  @Column({ length: 30, default: 'PENDIENTE' })
  estado!: string;

  @Column({ name: 'resuelto_por', type: 'integer', nullable: true })
  resuelto_por?: number | null;

  @Column({ name: 'fecha_resolucion', type: 'timestamp', nullable: true })
  fecha_resolucion?: Date | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  decision!: string;

  @Column({ type: 'text', nullable: true })
  motivo?: string | null;

  @Column({ name: 'id_sincronizacion', type: 'integer', nullable: true })
  id_sincronizacion?: number | null;

  @Column({ name: 'version_actual_servidor', type: 'integer', nullable: true })
  version_actual_servidor?: number | null;

  @Column({ name: 'version_base_recibida', type: 'integer', nullable: true })
  version_base_recibida?: number | null;
}
