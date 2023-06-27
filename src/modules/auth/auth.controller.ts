import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDTO, description: 'Successfully Registered' })
  // @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() userRegisterDto: RegisterDTO,
    // @UploadedFile() file?: IFile,
  ): Promise<UserDTO> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      // file,
    );

    return createdUser.toDTO({
      isActive: true,
    });
  }
}
