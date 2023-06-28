import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { PageDTO } from 'common/dto/page.dto';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreatePostCommand } from './command/create-post.command';
import type { PostDTO } from './dto/post.dto';
import { CreatePostDTO } from './dto/post.dto';
import type { PostPageOptionDTO } from './dto/post-page-option.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  @Transactional()
  createPost(userId: Uuid, createPostDto: CreatePostDTO): Promise<PostEntity> {
    return this.commandBus.execute<CreatePostCommand, PostEntity>(
      new CreatePostCommand(userId, createPostDto),
    );
  }

  async getAllPost(query: PostPageOptionDTO): Promise<PageDTO<PostDTO>> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.translations', 'postTranslation');

    const [items, pageMetaDto] = await queryBuilder.paginate(query);

    return items.toPageDto(pageMetaDto);
  }
}
