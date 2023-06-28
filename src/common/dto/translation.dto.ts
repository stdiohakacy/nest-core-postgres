import { LanguageCode } from '../../constants';
import { EnumField, StringField } from '../../decorators';

export class CreateTranslationDTO {
  @EnumField(() => LanguageCode)
  languageCode: LanguageCode;

  @StringField()
  text: string;
}
