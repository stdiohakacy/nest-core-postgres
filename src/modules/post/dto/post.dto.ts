import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDTO } from '../../../common/dto/abstract.dto';
import { CreateTranslationDTO } from '../../../common/dto/translation.dto';
import {
  DynamicTranslate,
  StaticTranslate,
  TranslationsField,
} from '../../../decorators';
import type { PostEntity } from '../post.entity';
import { PostTranslationDTO } from './post-translation.dto';

export class CreatePostDTO {
  @TranslationsField({ type: CreateTranslationDTO })
  title: CreateTranslationDTO[];

  @TranslationsField({ type: CreateTranslationDTO })
  description: CreateTranslationDTO[];
}

export class PostDTO extends AbstractDTO {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  @ApiPropertyOptional({ type: PostTranslationDTO, isArray: true })
  translations?: PostTranslationDTO[];

  constructor(postEntity: PostEntity) {
    super(postEntity);
    this.info = 'keywords.admin';
  }
}
