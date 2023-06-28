import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreatePostHandler } from './command/create-post.command';
import { PostController } from './post.controller';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';
import { PostTranslationEntity } from './post-translation.entity';

export const handlers = [CreatePostHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PostEntity, PostTranslationEntity]),
  ],
  providers: [PostService, ...handlers],
  controllers: [PostController],
})
export class PostModule {}
