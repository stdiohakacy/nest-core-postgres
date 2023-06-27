import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDTO } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants/role-type';
import type { UserEntity } from '../user.entity';

export type UserDTOOptions = Partial<{ isActive: boolean }>;

export class UserDTO extends AbstractDTO {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDTOOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
