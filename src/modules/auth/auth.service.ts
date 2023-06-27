import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import type { RoleType } from '../../constants';
import { TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import type { LoginDTO } from './dto/login.dto';
import { TokenPayloadDTO } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDTO> {
    return new TokenPayloadDTO({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(payload: LoginDTO): Promise<UserEntity> {
    const { email, password } = payload;
    const user = await this.userService.findOne({ email });
    const isPasswordValid = await validateHash(password, user?.password);

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }
}
