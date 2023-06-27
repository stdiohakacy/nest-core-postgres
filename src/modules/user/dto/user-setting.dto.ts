import { BooleanFieldOptional } from '../../../decorators';

export class CreateSettingDTO {
  @BooleanFieldOptional()
  isEmailVerified: boolean;

  @BooleanFieldOptional()
  isPhoneVerified: boolean;
}
