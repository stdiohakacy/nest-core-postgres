import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { TranslationService } from './services/translation.service';

const providers: Provider[] = [ApiConfigService, TranslationService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
