import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Constructor } from '../types';
import type { AbstractDTO } from './dto/abstract.dto';

export interface IAbstractEntity<DTO extends AbstractDTO, O = never> {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;

  toDTO(options?: O): DTO;
}

export abstract class AbstractEntity<
  DTO extends AbstractDTO = AbstractDTO,
  O = never,
> implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  private dtoClass?: Constructor<DTO, [AbstractEntity, O?]>;

  toDTO(options?: O | undefined): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDTO on class (${this.constructor.name}) be able to call toDTO function`,
      );
    }

    return new dtoClass(this, options);
  }
}
