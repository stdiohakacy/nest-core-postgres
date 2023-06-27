import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LoginPayloadDTO } from './dto/login-payload.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDTO, description: 'Successfully Registered' })
  // @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() payload: RegisterDTO,
    // @UploadedFile() file?: IFile,
  ): Promise<UserDTO> {
    const createdUser = await this.userService.createUser(
      payload,
      // file,
    );

    return createdUser.toDTO({
      isActive: true,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDTO,
    description: 'User info with access token',
  })
  async login(@Body() payload: LoginDTO): Promise<LoginPayloadDTO> {
    const userEntity = await this.authService.validateUser(payload);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDTO(userEntity.toDTO(), token);
  }
}
