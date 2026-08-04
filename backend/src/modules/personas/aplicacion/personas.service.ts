import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PersonaEntity } from '../infraestructura/entidades/persona.entity';
import { CrearPersonaDto, ActualizarPersonaDto } from '../dominio/dto/persona.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly personaRepo: Repository<PersonaEntity>,
  ) {}

  // ─── GET /personas ────────────────────────────────────────────────────────
  async findAll(
    termino?: string,
    estado?: string,
    pagina = 1,
    limite = 20,
  ): Promise<{ datos: PersonaEntity[]; total: number; pagina: number; limite: number; total_paginas: number }> {
    const where: any = {};
    if (estado) where.estado = estado;

    const queryBuilder = this.personaRepo.createQueryBuilder('p');
    if (estado) queryBuilder.andWhere('p.estado = :estado', { estado });
    if (termino) {
      queryBuilder.andWhere(
        '(p.numero_documento ILIKE :t OR p.nombres ILIKE :t OR p.apellidos ILIKE :t)',
        { t: `%${termino}%` },
      );
    }

    const offset = (pagina - 1) * limite;
    queryBuilder.skip(offset).take(limite).orderBy('p.apellidos', 'ASC');

    const [datos, total] = await queryBuilder.getManyAndCount();
    return { datos, total, pagina, limite, total_paginas: Math.ceil(total / limite) };
  }

  // ─── GET /personas/:numero_documento ─────────────────────────────────────
  async findOne(numeroDocumento: string): Promise<PersonaEntity> {
    const persona = await this.personaRepo.findOne({
      where: { numero_documento: numeroDocumento },
    });
    if (!persona) {
      throw new NotFoundException(`Persona con documento ${numeroDocumento} no encontrada`);
    }
    return persona;
  }

  // ─── POST /personas ───────────────────────────────────────────────────────
  async create(dto: CrearPersonaDto): Promise<PersonaEntity> {
    const existente = await this.personaRepo.findOne({
      where: { numero_documento: dto.numero_documento },
    });
    if (existente) {
      throw new ConflictException(
        `Ya existe una persona con documento ${dto.numero_documento}`,
      );
    }
    const nueva = this.personaRepo.create({
      ...dto,
      estado: 'Activo',
      estado_sincronizacion: 'SYNCED',
    });
    return this.personaRepo.save(nueva);
  }

  // ─── PUT /personas/:numero_documento ─────────────────────────────────────
  async update(
    numeroDocumento: string,
    dto: ActualizarPersonaDto,
  ): Promise<PersonaEntity> {
    const persona = await this.findOne(numeroDocumento);
    Object.assign(persona, dto);
    persona.estado_sincronizacion = 'SYNCED';
    return this.personaRepo.save(persona);
  }

  // ─── DELETE /personas/:numero_documento (inactivación lógica) ────────────
  async inactivar(numeroDocumento: string): Promise<{ message: string }> {
    const persona = await this.findOne(numeroDocumento);
    if (persona.estado === 'Inactivo') {
      throw new ConflictException('La persona ya se encuentra Inactiva');
    }
    persona.estado = 'Inactivo';
    persona.estado_sincronizacion = 'SYNCED';
    await this.personaRepo.save(persona);
    return { message: `Persona ${numeroDocumento} inactivada exitosamente` };
  }
}
