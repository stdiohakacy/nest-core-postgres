import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateSettingDTO } from '../dto/user-setting.dto';
import { UserSettingsEntity } from '../user-setting.entity';

export class CreateSettingCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly payload: CreateSettingDTO,
  ) {}
}

@CommandHandler(CreateSettingCommand)
export class CreateSettingHandler
  implements ICommandHandler<CreateSettingCommand, UserSettingsEntity>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepo: Repository<UserSettingsEntity>,
  ) {}

  execute(command: CreateSettingCommand): Promise<UserSettingsEntity> {
    const { userId, payload } = command;
    const userSetting = this.userSettingRepo.create(payload);
    userSetting.userId = userId;

    return this.userSettingRepo.save(userSetting);
  }
}
