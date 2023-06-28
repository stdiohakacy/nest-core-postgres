import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { RegisterDTO } from '../auth/dto/register.dto';
import { CreateSettingCommand } from './command/create-setting.command';
import type { UserDTO } from './dto/user.dto';
import { CreateSettingDTO } from './dto/user-setting.dto';
import { UserEntity } from './user.entity';
import type { UserSettingsEntity } from './user-setting.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly commandBus: CommandBus,
  ) {}

  @Transactional()
  async createUser(payload: RegisterDTO) {
    const user = this.userRepo.create(payload);
    await this.userRepo.save(user);
    user.settings = await this.createSettings(
      user.id,
      plainToClass(CreateSettingDTO, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );

    return user;
  }

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepo.findOneBy(findData);
  }

  async createSettings(
    userId: Uuid,
    payload: CreateSettingDTO,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<CreateSettingCommand, UserSettingsEntity>(
      new CreateSettingCommand(userId, payload),
    );
  }

  async getUser(id: Uuid): Promise<UserDTO> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    return user.toDTO();
  }
}
