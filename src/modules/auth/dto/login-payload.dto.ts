import { ApiProperty } from '@nestjs/swagger';

import { UserDTO } from '../../user/dto/user.dto';
import { TokenPayloadDTO } from './token-payload.dto';

export class LoginPayloadDTO {
  @ApiProperty({ type: UserDTO })
  user: UserDTO;

  @ApiProperty({ type: TokenPayloadDTO })
  token: TokenPayloadDTO;

  constructor(user: UserDTO, token: TokenPayloadDTO) {
    this.user = user;
    this.token = token;
  }
}
