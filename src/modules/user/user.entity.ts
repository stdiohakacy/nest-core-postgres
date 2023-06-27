import { Column, Entity, OneToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDTO, VirtualColumn } from '../../decorators';
import type { UserDTOOptions } from './dto/user.dto';
import { UserDTO } from './dto/user.dto';
import { UserSettingsEntity } from './user-setting.entity';

export interface IUserEntity extends IAbstractEntity<UserDTO> {
  firstName?: string;
  lastName?: string;
  role: RoleType;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  fullName?: string;
}

@Entity({ name: 'users' })
@UseDTO(UserDTO)
export class UserEntity
  extends AbstractEntity<UserDTO, UserDTOOptions>
  implements IUserEntity
{
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @VirtualColumn()
  fullName?: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;
}
