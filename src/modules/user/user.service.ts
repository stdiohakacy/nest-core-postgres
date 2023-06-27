import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { RegisterDTO } from '../auth/dto/register.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Transactional()
  async createUser(payload: RegisterDTO) {
    const user = this.userRepo.create(payload);
    await this.userRepo.save(user);

    return user;
  }

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepo.findOneBy(findData);
  }
}
