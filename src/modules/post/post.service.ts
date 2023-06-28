import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';

import { CreatePostCommand } from './command/create-post.command';
import { CreatePostDTO } from './dto/post.dto';
import type { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(private readonly commandBus: CommandBus) {}

  @Transactional()
  createPost(userId: Uuid, createPostDto: CreatePostDTO): Promise<PostEntity> {
    return this.commandBus.execute<CreatePostCommand, PostEntity>(
      new CreatePostCommand(userId, createPostDto),
    );
  }
}
