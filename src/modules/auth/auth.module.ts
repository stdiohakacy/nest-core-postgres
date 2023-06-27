import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
