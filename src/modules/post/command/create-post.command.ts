import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'lodash';
import { Repository } from 'typeorm';

import type { CreatePostDTO } from '../dto/post.dto';
import { PostEntity } from '../post.entity';
import { PostTranslationEntity } from '../post-translation.entity';

export class CreatePostCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly payload: CreatePostDTO,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, PostEntity>
{
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(PostTranslationEntity)
    private postTranslationRepo: Repository<PostTranslationEntity>,
  ) {}

  async execute(command: CreatePostCommand) {
    const { userId, payload } = command;
    const post = this.postRepo.create({ userId });
    const translations: PostTranslationEntity[] = [];
    await this.postRepo.save(post);

    // FIXME: Create generic function for translation creation
    for (const createTranslationDTO of payload.title) {
      const languageCode = createTranslationDTO.languageCode;
      const translation = this.postTranslationRepo.create({
        postId: post.id,
        languageCode,
        title: createTranslationDTO.text,
        description: find(payload.description, {
          languageCode,
        })!.text,
      });
      translations.push(translation);
    }

    await this.postTranslationRepo.save(translations);
    post.translations = translations;

    return post;
  }
}
